const axios = require('axios');
const User = require('../models/user');
const { StatusCodes } = require('http-status-codes');

const googleCallback = async (req, res) => {
  try {

    let user = await User.findOne({ googleId: req.user.googleId });
    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}`);
  }
  const frontendBaseUrl = process.env.FRONTEND_URL.replace(/\/$/, ''); 
  const redirectUrl = `${frontendBaseUrl}/Mail?token=${req.user.accessToken}`;
    return res.redirect(redirectUrl);
    
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Google authentication failed',
      error: error.message
    });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
      }
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch user',
      error: error.message
    });
  }
};

module.exports = {
  googleCallback,
  getCurrentUser
};
