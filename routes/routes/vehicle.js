const express = require('express');
const router = express.Router();
const Vehicle = require('../../models/vehicle'); 
const authenticateToken = require('../../middleware/authenticateToken'); 
const multer = require('multer');

const PORT = 3007;
const FILE_PATH = `http://192.168.137.69:${PORT}/postimage/`;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/postimage");
  },
  filename: (req, file, cb) => {
    let filename = file.originalname.toLowerCase();
    cb(null, filename);
  },
});

const postimage = multer({ storage: storage });

// Route to test the index
router.get('/', (req, res) => {
  res.json({ msg: "This is the vehicle index route" });
});

// Get all vehicles
router.get('/vehicles', authenticateToken, async (req, res) => {
  try {
    const vehicles = await Vehicle.find().lean();
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single vehicle by ID
router.get('/vehicles/:id', authenticateToken, async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).lean();
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.status(200).json(vehicle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new vehicle
router.post('/vehicles', postimage.any(), async (req, res) => {
    const { name, type, capacity, passenger , luggage, amenities, available  } = req.body;
    console.log('Request Body:', req.body);
    console.log('Request Files:', req.files);
  
    // Check if files are uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Profile image is required' });
    }
  
    // Validate inputs
    if (!name || !type || !capacity || !passenger || !luggage) {
      return res.status(400).json({ error: 'All fields are required' });
    }
  
    try {
      // Assuming that only one file will be uploaded
      const vehicleImagePath = FILE_PATH + req.files[0].filename;
      
      const vehicle = new Vehicle({
        name,
        type,
        capacity,
        passenger,         
        luggage,     
        amenities,  
        image: vehicleImagePath,
      });
  
      await vehicle.save();
      res.status(201).json({ message: 'Vehicle created successfully' });
    } catch (error) {
      console.error('Error creating vehicle:', error);
      res.status(500).json({ error: 'Failed to create vehicle' });
    }
  });

// Update a vehicle by ID
router.put('/vehicles/:id', authenticateToken, async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.status(200).json(vehicle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a vehicle by ID
router.delete('/vehicles/:id', authenticateToken, async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id).lean();
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
