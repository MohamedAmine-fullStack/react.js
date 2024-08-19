const express = require('express');
const router = express.Router();

// Middleware to check authentication
const isAuthenticated = (req, res, next) => {
  if (req.session.user && req.session.user.type === 'user') {
    next();
  } else {
    res.redirect('/user/login');
  }
};

// Route for user dashboard
router.get('/user/dashboard', isAuthenticated, (req, res) => {
  // Pass user data to the view
  res.render('user/dashboard', { user: req.session.user, title: 'User Dashboard' });
});

// Route to handle user logout
router.get('/user/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Logout error:', err);
      return res.redirect('/user/dashboard'); // Handle error
    }
    res.redirect('/user/login');
  });
});

module.exports = router;
