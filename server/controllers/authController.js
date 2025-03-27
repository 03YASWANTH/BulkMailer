// controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');

// Generate JWT token for authenticated users
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

//Original Google login callback
const googleCallback =async (req, res) => {
  try {
    // Passport attaches user to req
    const token = generateToken(req.user);
    req.token = token;
    res.redirect(`${process.env.FRONTEND_URL}/Scan?token=${token}`);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Authentication failed',
    });
  }
};






// const googleCallback = async (req, res) => {
//   try {
//     // Passport attaches user to req
//     const user = req.user;  // Get user details
//     const token = generateToken(user);

//     res.status(StatusCodes.OK).json({
//       success: true,
//       message: 'Google authentication successful',
//       data: 
//       {
//         token: token
//       }
//     });
//   } catch (error) {
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       message: 'Authentication failed'
//     });
//   }
// };


// Complete user profile (after Google auth)
const completeProfile = async (req, res) => {
  try {
    const { phoneNumber, upiId } = req.body;
    const userId = req.user.id;
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { phoneNumber, upiId },
      { new: true, runValidators: true }
    );
    
    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        user: {
          name: updatedUser.name,
          email: updatedUser.email,
          phoneNumber: updatedUser.phoneNumber,
          profilePicture: updatedUser.profilePicture
        }
      }
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: error.message
    });
  }
};

// Get current user profile
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-__v');
    
    res.status(StatusCodes.OK).json({
      success: true,
      data: { user:user}
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error fetching user profile'
    });
  }
};

module.exports = {
  googleCallback,
  completeProfile,
  getCurrentUser
};