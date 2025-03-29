const axios = require('axios');
const { StatusCodes } = require('http-status-codes');
const User = require('../models/User');

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: 'Authentication invalid'
    });
  }

  const accessToken = authHeader.split(' ')[1];

  try {
    // Verify Google access token and fetch user info
    const tokenResponse = await axios.get(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        timeout: 5000
      }
    );

    // Find user in database by Google ID
    const user = await User.findOne({
      googleId: tokenResponse.data.sub
    });

    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'User not found'
      });
    }

    // Attach comprehensive user info to request
    req.user = {
      id: user._id,
      email: tokenResponse.data.email,
      googleId: user.googleId,
      accessToken: accessToken,
      refreshToken:user.refreshToken,
      name: tokenResponse.data.name,
      picture: tokenResponse.data.picture
    };
    next();
  } catch (error) {
    console.error('Authentication error:', error);

    // Differentiate between different types of authentication errors
    if (error.response) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Invalid access token',
        error: error.response.data
      });
    } else if (error.request) {
      return res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
        success: false,
        message: 'Unable to verify token',
        error: 'No response from authentication service'
      });
    } else {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Authentication failed',
        error: error.message
      });
    }
  }
};

module.exports = { authenticateUser };