const jwt = require('jsonwebtoken');

// Middleware function to authenticate JWT
const authenticateToken = (req, res, next) => {
  // Extract token from Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401); // If no token, return 401

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403); // If token is invalid, return 403
    req.user = user; // Attach user info to request object
    next(); // Proceed to the next middleware or route handler
  });
};

module.exports = authenticateToken;
