import User from '../models/User.js'; 
import bcrypt from 'bcryptjs'; 
import crypto from 'crypto'; 

// Function to register a new user
export const registerUser = async (req, res) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    if (firstName.trim() === "" || lastName.trim() === "" || email.trim() === "" || password.trim() === "") {
        req.flash("message", {type: 'error', content: 'Veuillez remplir tous les champs'})
        return res.redirect('/register');
    }

    // Check if all required fields are provided
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        req.flash('message', { type: 'error', content: 'All fields are required' });
        return res.redirect('/register');
    }


    // Check if passwords match
    if (password !== confirmPassword) {
        req.flash('message', { type: 'error', content: 'Passwords do not match' });
        return res.redirect('/register');
    }

    try {
        // Check if user with the same email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            req.flash('message', { type: 'error', content: 'User already exists' });
            return res.redirect('/register');
        }

        // Create a new user and save to the database
        const newUser = new User({ firstName, lastName, email, password });
        await newUser.save();
        req.flash('message', { type: 'success', content: 'User registered successfully' });
        res.redirect('/login');
    } catch (error) {
        // Handle registration error
        req.flash('message', { type: 'error', content: 'Error registering user' });
        res.redirect('/register');
    }
};

// Function to authenticate user login
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
        req.flash('message', { type: 'error', content: 'All fields are required' });
        return res.redirect('/login');
    }

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            req.flash('message', { type: 'error', content: 'User not found' });
            return res.redirect('/login');
        }

        // Hash the provided password and compare with stored hash
        const secret = process.env.SECRET_KEY;
        const hash = crypto.createHmac('sha256', secret).update(password).digest('hex');
        if (!bcrypt.compareSync(hash, user.password)) {
            req.flash('message', { type: 'error', content: 'Invalid email or password' });
            return res.redirect('/login');
        }

        // Set user session and redirect to dashboard
        req.session.user = user;
        res.redirect('/dashboard');
    } catch (error) {
        // Handle login error
        req.flash('message', { type: 'error', content: 'Error logging in' });
        res.redirect('/login');
    }
};

export const logoutUser = (req, res ) => {
    req.session.destroy(err => {
        if(err) {
            console.error('Erreur lors de la deconnexion', err);
            return res.redirect('/dashboard');
        }
        res.redirect('/login');
    })
}

// Middleware to ensure user authentication
export const ensureAuthenticated = (req, res, next) => {
    if (req.session.user) return next(); // If user is authenticated, proceed
    
    // If user is not authenticated, redirect to login page
    req.flash('message', { type: 'error', content: 'Please log in to view this page' });
    res.redirect('/login');
};
