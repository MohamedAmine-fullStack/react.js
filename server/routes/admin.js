const express = require('express');
const router = express.Router();

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.type === 'admin') {
    next();
  } else {
    res.redirect('/admin/login');
  }
};

// Route for admin dashboard
router.get('/admin/dashboard', isAdmin, (req, res) => {
  // Pass user data to the view
  res.render('admin/dashboard', { user: req.session.user, title: 'Admin Dashboard' });
});

// Route to handle admin logout
router.get('/admin/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Logout error:', err);
      return res.redirect('/admin/dashboard'); // Handle error
    }
    res.redirect('/admin/login');
  });
});

module.exports = router;
