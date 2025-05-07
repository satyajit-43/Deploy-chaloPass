// const User = require('../models/User');

// exports.validateQR = async (req, res) => {
//   try {
//     const { qrData } = req.body;

//     // Extract the unique identifier from QR data
//     const qrCode = qrData.split(':').pop(); // Assuming format "chalopass:email:UUID"

//     // Find user by QR code
//     const user = await User.findOne({ qrCode })
//       .select('-password -__v');

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       user: {
//         id: user._id,
//         name: user.name,
//         walletBalance: user.walletBalance
//       }
//     });

//   } catch (error) {
//     console.error('QR validation error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error validating QR code'
//     });
//   }
// };





// const User = require('../models/User');

// exports.validateQR = async (req, res) => {
//   try {
//     const { qrData } = req.body;

//     // Validate input
//     if (!qrData) {
//       return res.status(400).json({
//         success: false,
//         message: 'QR code data is required'
//       });
//     }

//     // Extract the QR code value (handles both full format and raw UUID)
//     let qrCode;
//     if (qrData.includes(':')) {
//       // If QR data is in format "chalopass:email:UUID"
//       qrCode = qrData.split(':').pop();
//     } else {
//       // If QR data is just the UUID
//       qrCode = qrData;
//     }

//     // Validate QR code format (basic UUID check)
//     if (!qrCode.match(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid QR code format'
//       });
//     }

//     // Find user by QR code
//     const user = await User.findOne({ qrCode })
//       .select('-password -__v -transactions -createdAt');

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'No account associated with this QR code'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         walletBalance: user.walletBalance,
//         qrCode: user.qrCode
//       }
//     });

//   } catch (error) {
//     console.error('QR validation error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error during QR validation',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// };









// controllers/qrController.js
const User = require('../models/User');
const Ticket = require('../models/Ticket');

exports.validateQRCode = async (req, res) => {
  try {
    const { qrData } = req.body;

    // Validate input exists
    if (!qrData) {
      return res.status(400).json({
        success: false,
        message: 'QR code data is required'
      });
    }

    // Find user by the exact QR code (no parsing needed)
    const user = await User.findOne({ qrCode: qrData })
      .select('-password -__v -transactions -createdAt');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account associated with this QR code'
      });
    }

    res.status(200).json({
      success: true,
      user: {  // Changed from 'data' to 'user' to match frontend
        id: user._id,
        name: user.name,
        email: user.email,
        walletBalance: user.walletBalance,
        qrCode: user.qrCode
      }
    });

  } catch (error) {
    console.error('QR validation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during QR validation'
    });
  }
};




exports.validateAndBookTicket = async (req, res) => {
  try {
    const { qrData, source, destination, fare } = req.body;

    // Validate input
    if (!qrData || !source || !destination || !fare) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Extract user ID from QR data (assuming format "user:user_id")
    const userId = qrData.split(':')[1];
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid QR format'
      });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check wallet balance
    if (user.walletBalance < fare) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });
    }

    // Deduct fare and create ticket
    user.walletBalance -= fare;
    await user.save();

    const ticket = await Ticket.create({
      userId: user._id,
      source,
      destination,
      fare,
      status: 'booked'
    });

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        walletBalance: user.walletBalance
      },
      ticket: {
        id: ticket._id,
        source: ticket.source,
        destination: ticket.destination,
        fare: ticket.fare,
        bookedAt: ticket.createdAt
      }
    });

  } catch (error) {
    console.error('Ticket booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during ticket booking'
    });
  }
};





const FARES = {
  'mumbai central': {
    'pune station': 400,
    'nashik road': 350,
    'nagpur': 900,
    'thane': 100
  },
  'pune station': {
    'mumbai central': 400,
    'nashik road': 300,
    'nagpur': 850,
    'thane': 450
  },
  'nashik road': {
    'mumbai central': 350,
    'pune station': 300,
    'nagpur': 800,
    'thane': 200
  },
  'nagpur': {
    'mumbai central': 900,
    'pune station': 850,
    'nashik road': 800,
    'thane': 950
  },
  'thane': {
    'mumbai central': 100,
    'pune station': 450,
    'nashik road': 200,
    'nagpur': 950
  }
};


exports.validateQR = async (req, res) => {
  const { qrData, source, destination } = req.body;

  try {
    if (!qrData || !source || !destination) {
      return res.status(400).json({ success: false, message: 'QR, source, and destination are required' });
    }

    const user = await User.findOne({ qrCode: qrData });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found with this QR code' });
    }

    const fare = FARES[source.toLowerCase()]?.[destination.toLowerCase()];

    if (fare === undefined) {
      return res.status(400).json({ success: false, message: 'Invalid route selected' });
    }

    if (user.walletBalance < fare) {
      return res.status(400).json({ success: false, message: 'Insufficient wallet balance' });
    }

    // Deduct fare
    user.walletBalance -= fare;

    // Log transaction
    user.transactions.push({
      amount: fare,
      type: 'debit',
      description: `Bus fare from ${source} to ${destination}`
    });

    const savedUser = await user.save();
    console.log("Fare:", fare, "New Balance:", savedUser.walletBalance);

    return res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        walletBalance: user.walletBalance,
        qrCode: user.qrCode,
        fare: fare  // <-- make sure to include this
      }
    });

  } catch (err) {
    console.error('QR validation error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
};


