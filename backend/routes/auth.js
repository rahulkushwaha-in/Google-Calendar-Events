const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');

// Google OAuth login route
router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar'],
    accessType: 'offline',
    prompt: 'consent',
  })
);

// Google OAuth callback route
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect(process.env.CLIENT_URL);
  }
);

// Get current user
router.get('/current-user', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  res.json(req.user);
});

// Logout route
router.get('/logout', (req, res) => {
  req.logout((err)=>{
    if (err) {
      return res.status(500).json({ error: 'Error logging out' });
      }
      res.redirect(process.env.CLIENT_URL);
  });
});

module.exports = router;