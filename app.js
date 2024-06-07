import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import flash from 'connect-flash';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import router from './routes/router.js';

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: false }));

// Connect to MongoDB database
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Successfully connected to the database"))
    .catch(err => console.log(err));

// Set up session middleware
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false
}));
// Flash messages middleware
app.use(flash());

// Middleware to pass flash messages to views
app.use((req, res, next) => {
    const messages = req.flash('message');
    res.locals.message = messages.length > 0 ? messages : [];
    next();
});

// Set up Pug as the view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Use router middleware for handling routes
app.use('/', router);

// Set up port for the server to listen on
const port = process.env.PORT || 9000;
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
