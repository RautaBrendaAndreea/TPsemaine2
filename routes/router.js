import express from 'express'; 
import { registerUser, loginUser, ensureAuthenticated } from '../controllers/userController.js'; 
const router = express.Router(); 


// Route for registering a user
router.route('/register')
    .get((req, res) => res.render('register', { messages: req.flash() })) // Render registration form
    .post(registerUser); // Handle registration POST request

// Route for logging in a user
router.route('/login')
    .get((req, res) => res.render('login', { messages: req.flash() })) // Render login form
    .post(loginUser); // Handle login POST request

// Route for accessing the dashboard, requires authentication
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('dashboard', { user: req.session.user }); // Render dashboard view with user data
});

export default router; 
