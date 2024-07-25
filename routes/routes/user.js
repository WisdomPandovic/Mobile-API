const express = require('express');
const User = require('../../models/user');
const PaymentMethod = require('../../models/PaymentMethod.JS');
const OTP = require('../../models/OTP');
const sendOTPEmail = require('../../utils/sendSMSThroughEmail'); 
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const multer = require("multer");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); 
const PORT = 3007;
const FILE_PATH = `http://192.168.137.69:${PORT}/postimage/`;
const authenticateToken = require('../../middleware/authenticateToken');

const storage = multer.diskStorage({
  destination: (reg, file, cb)=> {
  cb(null, "public/postimage")

  },
  filename: (reg, file, cb) =>{
      let filename = file.originalname.toLowerCase();
      cb(null, filename);
  },
});

const postimage = multer({storage: storage});

const JWT_SECRET = process.env.JWT_SECRET_KEY; 

// Route to test the index
router.get('/', (req, res) => {
  res.json({ msg: "This is my user index route" });
});

router.get('/users', async (req, res) => {
  try {
      let users = await User.find().lean();
      res.json(users);
  } catch (err) {
      res.status(500).send(err.message);
  }
});

router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).lean();
    if (user) {
      res.json(user);
    } else {
      res.status(404).send('User not found');
    }
  } catch (err) {
    console.error('Error fetching user data:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Endpoint to send OTP via email
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const otp = crypto.randomInt(1000, 9999).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // OTP valid for 5 minutes

  await OTP.findOneAndUpdate(
    { email },
    { otp, expiresAt },
    { upsert: true, new: true }
  );

  try {
    await sendOTPEmail(email, otp);
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Endpoint to resend OTP via email
// router.post('/resend-otp', async (req, res) => {
//   const { email } = req.body;

//   // Validate email
//   if (!email) {
//     return res.status(400).json({ error: 'Email is required' });
//   }

//   // Generate new OTP
//   const otp = crypto.randomInt(1000, 9999).toString();

//   // Update OTP store with new OTP
//   global.otpStore = { email, otp, expiresAt: Date.now() + 5 * 60 * 1000 }; // OTP valid for 5 minutes

//   console.log('Resent OTP:', otp); // Log resent OTP for debugging

//   // Send OTP via email
//   try {
//     await sendOTPEmail(email, otp);
//     res.status(200).json({ message: 'OTP resent successfully' });
//   } catch (error) {
//     console.error('Error resending OTP:', error);
//     res.status(500).json({ error: 'Failed to resend OTP' });
//   }
// });

// Endpoint to verify OTP
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ error: 'Email and OTP are required' });

  const record = await OTP.findOne({ email, otp });
  if (record && record.expiresAt > Date.now()) {
    await OTP.deleteOne({ email, otp });
    res.status(200).json({ message: 'OTP verified successfully' });
  } else {
    res.status(400).json({ error: 'Invalid or expired OTP' });
  }
});

// Endpoint to verify OTP
router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  // Validate inputs
  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP are required' });
  }

  console.log('Stored OTP:', global.otpStore); // Log the stored OTP for debugging
  console.log('Received OTP:', otp); // Log the received OTP for debugging

  // Check OTP
  if (global.otpStore && global.otpStore.email === email && global.otpStore.otp === otp && Date.now() < global.otpStore.expiresAt) {
    delete global.otpStore; // Clear OTP after successful verification
    res.status(200).json({ message: 'OTP verified successfully' });
  } else {
    res.status(400).json({ error: 'Invalid OTP' });
  }
});

// Endpoint to set and confirm password
router.post('/set-password', async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;
  console.log('Request Body:', req.body);

  // Validate inputs
  if (!email || !newPassword || !confirmPassword) {
    return res.status(400).json({ error: 'Email, new password, and confirmation password are required' });
  }

  // Check if passwords match
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  try {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Find and update the user's password
    const user = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    // if (!user) {
    //   return res.status(404).json({ error: 'User not found' });
    // }

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ error: 'Failed to update password' });
  }
});

// Endpoint to complete profile
router.post('/complete-profile', postimage.any(), async (req, res) => {
  const { phoneNumber, gender, city, street, email, password, username  } = req.body;
  console.log('Request Body:', req.body);
  console.log('Request Files:', req.files);

  // Check if files are uploaded
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'Profile image is required' });
  }

  // Validate inputs
  if (!phoneNumber || !gender || !city || !street) {
    return res.status(400).json({ error: 'All fields except profile image are required' });
  }

  try {
    // Assuming that only one file will be uploaded
    const profileImagePath = FILE_PATH + req.files[0].filename;
    
    const user = new User({
      phoneNumber,
      gender,
      city,
      street,
      email,          // Add email
      password,       // Add password
      username,  
      profileImage: profileImagePath,
    });

    await user.save();
    res.status(201).json({ message: 'Profile created successfully' });
  } catch (error) {
    console.error('Error creating profile:', error);
    res.status(500).json({ error: 'Failed to create profile' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ success: false, msg: 'Invalid username or password' });
    }

    // Compare the plain text password with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      // Update the lastLogin field
      user.lastLogin = new Date();
      await user.save();

      // Generate a JWT token
      const token = jwt.sign(
        { userId: user._id, username: user.username, phoneNumber: user.phoneNumber, email: user.email, gender: user.gender, city: user.city,
          profileImage: user.profileImage
         },
        JWT_SECRET,
        { expiresIn: '1h' } // Token expires in 1 hour
      );

      // Return success response with token
      res.json({ success: true, msg: 'Login successful', token });
    } else {
      res.status(401).json({ success: false, msg: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error occurred during login:', error);
    res.status(500).json({ success: false, msg: 'Internal server error occurred' });
  }
});

// Endpoint to edit user details
router.put('/edit-account/:id', authenticateToken, postimage.any(), async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, phoneNumber, gender, city, street } = req.body;
    let updateFields = { username, email, phoneNumber, gender, city, street };

    if (req.files && req.files.length > 0) {
      updateFields.profileImage = FILE_PATH + req.files[0].filename;
    }

    const user = await User.findByIdAndUpdate(id, updateFields, { new: true });

    if (!user) {
      return res.status(404).json({ success: false, msg: 'User not found' });
    }

    res.status(200).json({ success: true, msg: 'Account updated successfully', user });
  } catch (error) {
    console.error('Error editing user account:', error);
    res.status(500).json({ success: false, msg: 'Internal server error occurred' });
  }
});

// Endpoint to delete a user account
router.delete('/delete-account/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ success: false, msg: 'User not found' });
    }

    res.status(200).json({ success: true, msg: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting user account:', error);
    res.status(500).json({ success: false, msg: 'Internal server error occurred' });
  }
});

router.post('/add-payment-method', async (req, res) => {
  const { userId, paymentMethodId } = req.body;

  try {
    // Retrieve user from database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Attach the payment method to the Stripe customer
    const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
      customer: user.stripeCustomerId, // Ensure user.stripeCustomerId exists
    });

    // Create a new PaymentMethod document
    const newPaymentMethod = new PaymentMethod({
      userId: user._id,
      stripePaymentMethodId: paymentMethod.id,
      last4: paymentMethod.card.last4,
      brand: paymentMethod.card.brand,
      expMonth: paymentMethod.card.exp_month,
      expYear: paymentMethod.card.exp_year,
    });

    // Save the payment method
    await newPaymentMethod.save();

    // Add the payment method to the user's paymentMethods array
    user.paymentMethods.push(newPaymentMethod._id);
    await user.save();

    res.status(200).send('Payment method added successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
