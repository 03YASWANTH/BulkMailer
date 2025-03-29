const axios = require('axios');
const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');

const googleCallback = async (req, res) => {
  try {
    // ✅ Fix: Get accessToken from req.user directly
    const access_token = req.user.accessToken;
    console.log(req.user.refreshToken);

    if (!access_token) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Access token is missing",
      });
    }

    // Fetch user info from Google
    const googleResponse = await axios.get(
      'https://www.googleapis.com/oauth2/v3/userinfo', 
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    const googleUser = googleResponse.data;

    // Find or create user in database
    let user = await User.findOne({ googleId: googleUser.sub });
    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}`);
  }
    const redirectUrl = `${process.env.FRONTEND_URL}/Mail?token=${access_token}`;
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
