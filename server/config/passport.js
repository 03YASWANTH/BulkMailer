require('dotenv').config(); 
const passport = require('passport'); 
const GoogleStrategy = require('passport-google-oauth20').Strategy; 
const User = require('../models/user');  

passport.serializeUser((user, done) => {   
  done(null, user.id); 
});  

passport.deserializeUser(async (id, done) => {   
  try {     
    const user = await User.findById(id);     
    done(null, user);   
  } catch (error) {     
    done(error, null);   
  } 
});  

passport.use(   
  new GoogleStrategy(     
    {       
      clientID: process.env.GOOGLE_CLIENT_ID,       
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,       
      callbackURL: 'https://bulk-mailer-mej8.vercel.app/api/auth/google/callback',       
      scope: [
        // Basic Profile and Authentication Scopes
        'profile', 
        'email', 
        'openid',
        
        // Gmail Specific Scopes
        'https://mail.google.com/',
        'https://www.googleapis.com/auth/gmail.send',
        'https://www.googleapis.com/auth/gmail.compose'
      ],       
      accessType: 'offline', // Required for refresh token       
      prompt: 'consent',     // Forces consent screen every login       
      includeGrantedScopes: true // Ensures existing permissions are included     
    },     
    async (accessToken, refreshToken, profile, done) => {       
      console.log("🔹 Received Refresh Token:", refreshToken || "NULL"); 
      console.log("🔹 Received Access Token:", accessToken || "NULL");
      
      try {         
        let user = await User.findOne({ googleId: profile.id });          
        
        if (!user) {           
          user = new User({             
            googleId: profile.id,             
            name: profile.displayName,             
            email: profile.emails[0].value,             
            profilePicture: profile.photos[0].value,             
            isVerified: profile.emails[0].verified || false,             
            refreshToken: refreshToken      
          });
        }           
        
        if (refreshToken) {             
          user.refreshToken = refreshToken;
        }           
        
        user.accessToken = accessToken;
        user.tokenExpiresAt = new Date(Date.now() + 3600 * 1000); // 1 hour from now
        
        await user.save();         
        return done(null, user);       
      } catch (error) {         
        console.error('Google OAuth Error:', error);
        return done(error, null);       
      }     
    }   
  ) 
);   

module.exports = passport;