const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Make sure this path is correct
const Product = require('../models/Product'); // Make sure this path is correct
const bcrypt = require('bcrypt'); // Import bcrypt for hashing passwords


// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.type === 'admin') {
    next();
  } else {
    res.redirect('/user/login');
  }
};

// Route for admin dashboard
router.get('/admin/dashboard', isAdmin, async (req, res) => {
  try {
    // Count total users and products
    const totalUsers = await User.countDocuments().exec();
    const totalProducts = await Product.countDocuments().exec();

    // Render the dashboard view with the counts and user data
    res.render('admin/dashboard', {
      title: 'Admin Dashboard',
      user: req.session.user,
      totalUsers,
      totalProducts
    });
  } catch (err) {
    console.error('Error fetching dashboard data:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Route to handle admin logout
router.get('/admin/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Logout error:', err);
      return res.redirect('/admin/dashboard'); // Redirect back to dashboard on error
    }
    res.redirect('/user/login'); // Redirect to login after successful logout
  });
});

//////////////////////// products ////////////////////////////////
router.get('/admin/users', isAdmin, async (req, res) => {
    try {
      const users = await User.find().lean().exec();
      res.render('admin/users', { title: 'Manage Users', users });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).send('Server Error');
    }
  });
  
  // Route to get user details for editing
  router.get('/admin/users/:id', isAdmin, async (req, res) => {
    console.log('POST /admin/users/add route hit');

    try {
      const user = await User.findById(req.params.id).lean().exec();
      res.json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).send('Server Error');
    }
  });
  
  // Route to handle adding a new user
  router.post('/admin/users/add', async (req, res) => {
    try {
        const { username, email, password, type } = req.body;

        // Check if all required fields are present
        if (!username || !email || !password || !type) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Create a new user
        const newUser = new User({
            username,
            email,
            password: await bcrypt.hash(password, 10), // Hash the password
            type // Include the type field
        });

        // Save the user to the database
        await newUser.save();

        // Redirect to the user management page
        res.redirect('/admin/users');
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


  
  
  
  // Route to handle editing a user
  router.post('/admin/users/edit/:id', isAdmin, async (req, res) => {
    const { username, email, role } = req.body;
    try {
      await User.findByIdAndUpdate(req.params.id, { username, email, role }).exec();
      res.sendStatus(200);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).send('Server Error');
    }
  });
  // Route to handle deleting a user
router.get('/admin/users/delete/:id', isAdmin, async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id).exec();
      res.redirect('/admin/users');
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).send('Server Error');
    }
  });
  

  ////////////////////////////////////////////////////////////////////////////////////////


module.exports = router;
