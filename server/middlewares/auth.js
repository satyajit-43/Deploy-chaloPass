const jwt = require('jsonwebtoken');
const User = require('../models/User');
// const ErrorResponse = require('../utils/errorResponse'); // Optional for better error handling

const protect = async (req, res, next) => {
  let token;

  // 1. Get token from header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // 2. Check if token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
    // Or without ErrorResponse:
    // return res.status(401).json({ success: false, message: 'Not authorized' });
  }

  try {
    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 4. Get user and attach to request
    req.user = await User.findById(decoded.id).select('-password');
    
    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
};

// Optionally add role authorization
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(`Role ${req.user.role} is not authorized`, 403)
      );
    }
    next();
  };
};

module.exports = {
  protect,
  authorize
};