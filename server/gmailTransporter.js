const { google } = require('googleapis');
const nodemailer = require('nodemailer');
const axios = require('axios');
const User = require('./models/User')

/**
 * Create Gmail transporter with OAuth2 authentication
 * @param {Object} req - Express request object
 * @param {Object} User - User model for database lookup
 * @returns {Object} Nodemailer transporter and user email
 */
const createGmailTransporter = async (req) => {
   try {
     // Validate required environment variables
     const requiredEnvVars = [
       'GOOGLE_CLIENT_ID', 
       'GOOGLE_CLIENT_SECRET',
       'GOOGLE_REDIRECT_URI'
     ];
     
     requiredEnvVars.forEach(envVar => {
       if (!process.env[envVar]) {
         throw new Error(`Missing environment variable: ${envVar}`);
       }
     });
     
     // Validate access token
     if (!req.user || !req.user.accessToken) {
       throw new Error('No access token provided');
     }
     
     // Fetch user from database to get refresh token
     const user = await User.find(req.user.id);
     console.log(user)
     if (!user || !user.refreshToken) {
       throw new Error('Refresh token not found for user');
     }
     
     // Create OAuth2 client
     const oauth2Client = new google.auth.OAuth2(
       process.env.GOOGLE_CLIENT_ID,
       process.env.GOOGLE_CLIENT_SECRET,
       process.env.GOOGLE_REDIRECT_URI
     );
     
     // Validate token by fetching user info
     const response = await axios.get(
       'https://www.googleapis.com/oauth2/v3/userinfo',
       {
         headers: {
           Authorization: `Bearer ${req.user.accessToken}`
         },
         timeout: 5000
       }
     );
     
     // Set credentials for OAuth2 client
     oauth2Client.setCredentials({
       access_token: req.user.accessToken
     });
     
     // Create transporter
     const transporter = nodemailer.createTransport({
       service: 'gmail',
       auth: {
         type: 'OAuth2',
         user: response.data.email,
         clientId: process.env.GOOGLE_CLIENT_ID,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
         refreshToken: user.refreshToken, // Fetched from user model
         accessToken: req.user.accessToken
       }
     });
     
     return {
       transporter,
       userEmail: response.data.email
     };
   } catch (error) {
     console.error('Email transporter creation error:', error);
     throw new Error(`Failed to create email transporter: ${error.message}`);
   }
};

module.exports = { createGmailTransporter };