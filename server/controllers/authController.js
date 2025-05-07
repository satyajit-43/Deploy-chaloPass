const User = require('../models/User');
const generateQR = require('../utils/generateQR');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      qrCode: await generateQR(email)
    });

    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        walletBalance: user.walletBalance,
        qrCode: user.qrCode
      }
    });
  } catch (err) {
    next(err);
  }
};


// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
  
      // Validate email & password
      if (!email || !password) {
        return res.status(400).json({ 
          success: false,
          message: 'Please provide email and password' 
        });
      }
  
      // Check for user
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({ 
          success: false,
          message: 'Invalid credentials' 
        });
      }
  
      // Check if password matches
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ 
          success: false,
          message: 'Invalid credentials' 
        });
      }
  
      // Create token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
      });
  
      res.status(200).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          walletBalance: user.walletBalance,
          qrCode: user.qrCode
        }
      });
    } catch (err) {
      next(err);
    }
  };




  exports.getMe = async (req, res) => {
    try {
      // req.user is set by the protect middleware
      const user = await User.findById(req.user.id)
        .select('-password -__v'); // Exclude sensitive fields
  
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
  
      res.status(200).json({
        success: true,
        data: user
      });
    } catch (err) {
      console.error('Get user error:', err);
      res.status(500).json({
        success: false,
        message: 'Server error while fetching user data'
      });
    }
  };













// const User = require('../models/User');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
// const crypto = require('crypto');
// const { validationResult } = require('express-validator');

// // Helper function to generate QR code data
// const generateQRData = (email) => {
//   return `chalopass:${email}:${crypto.randomBytes(16).toString('hex')}`;
// };

// // @desc    Register user
// // @route   POST /api/auth/register
// // @access  Public
// exports.register = async (req, res, next) => {
//   // Validate request body
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({
//       success: false,
//       errors: errors.array()
//     });
//   }

//   try {
//     const { name, email, password } = req.body;

//     // Check for existing user
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(409).json({
//         success: false,
//         message: 'Email already registered'
//       });
//     }

//     // Create user with hashed password
//     const hashedPassword = await bcrypt.hash(password, 12);
//     const qrCode = generateQRData(email);

//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       qrCode,
//       walletBalance: 1000 // Default balance
//     });

//     // Generate JWT token
//     const token = jwt.sign(
//       { id: user._id },
//       process.env.JWT_SECRET,
//       { expiresIn: process.env.JWT_EXPIRE }
//     );

//     // Secure response data
//     const userResponse = {
//       id: user._id,
//       name: user.name,
//       email: user.email,
//       walletBalance: user.walletBalance,
//       qrCode: user.qrCode,
//       createdAt: user.createdAt
//     };

//     res.status(201).json({
//       success: true,
//       token,
//       user: userResponse
//     });

//   } catch (err) {
//     console.error('Registration error:', err);
//     res.status(500).json({
//       success: false,
//       message: 'Server error during registration',
//       error: process.env.NODE_ENV === 'development' ? err.message : undefined
//     });
//   }
// };

// // @desc    Login user
// // @route   POST /api/auth/login
// // @access  Public
// exports.login = async (req, res, next) => {
//   // Validate request body
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({
//       success: false,
//       errors: errors.array()
//     });
//   }

//   try {
//     const { email, password } = req.body;

//     // Check for user existence
//     const user = await User.findOne({ email }).select('+password +active');
//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid credentials'
//       });
//     }

//     // Verify password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid credentials'
//       });
//     }

//     // Check if account is active
//     if (!user.active) {
//       return res.status(403).json({
//         success: false,
//         message: 'Account deactivated'
//       });
//     }

//     // Generate JWT token
//     const token = jwt.sign(
//       { id: user._id },
//       process.env.JWT_SECRET,
//       { expiresIn: process.env.JWT_EXPIRE }
//     );

//     // Secure response data
//     const userResponse = {
//       id: user._id,
//       name: user.name,
//       email: user.email,
//       walletBalance: user.walletBalance,
//       qrCode: user.qrCode,
//       createdAt: user.createdAt
//     };

//     res.status(200).json({
//       success: true,
//       token,
//       user: userResponse
//     });

//   } catch (err) {
//     console.error('Login error:', err);
//     res.status(500).json({
//       success: false,
//       message: 'Server error during login',
//       error: process.env.NODE_ENV === 'development' ? err.message : undefined
//     });
//   }
// };

// // @desc    Get current user profile
// // @route   GET /api/auth/me
// // @access  Private
// exports.getMe = async (req, res, next) => {
//   try {
//     const user = await User.findById(req.user.id)
//       .select('-password -__v -active -updatedAt');

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: user
//     });

//   } catch (err) {
//     console.error('Get user error:', err);
//     res.status(500).json({
//       success: false,
//       message: 'Server error while fetching user data',
//       error: process.env.NODE_ENV === 'development' ? err.message : undefined
//     });
//   }
// };