const User = require('../models/User');

exports.topUpWallet = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user.id;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid amount'
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $inc: { walletBalance: amount },
        $push: {
          transactions: {
            amount,
            type: 'credit',
            description: 'Wallet top-up'
          }
        }
      },
      { new: true }
    );

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        walletBalance: user.walletBalance,
        qrCode: user.qrCode,
        transactions: user.transactions
      }
    });

  } catch (error) {
    console.error('Top-up error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during wallet top-up'
    });
  }
};

exports.getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password -qrCode -__v');

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user data'
    });
  }
};