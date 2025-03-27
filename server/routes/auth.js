const express = require('express');
const router = express.Router();
const passport = require('passport');
const { googleCallback, completeProfile, getCurrentUser } = require('../controllers/authController');
const { authenticateUser } = require('../middlewares/auth');

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }), googleCallback);

// // Protected routes
// router.post('/complete-profile', authenticateUser, completeProfile);
router.get('/me', authenticateUser, getCurrentUser);

module.exports = router;