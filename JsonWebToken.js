import mongoose from "mongoose";
import express from "express";
import bcrypt from "bcryptjs";          // Bcrypt: For password hashing
import jwt from "jsonwebtoken";         // JWT: For token generation and verification

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

const secret = 'key'; // Secret key for JWT

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/jwtPrac")
    .then(() => {
        console.log("Connected to MongoDB");
    }).catch((err) => {
        console.log(err);
    });

// User schema definition
const userSchema = new mongoose.Schema({
    name: String,       // User's name
    email: String,      // User's email
    password: String    // User's hashed password
});

// User model creation
const User = mongoose.model("User", userSchema);

/**
 * Register endpoint
 * 1. Accepts POST request
 * 2. Expects name, email, password in the request body
 * 3. Hashes the password
 * 4. Creates a new user
 * 5. Saves the user
 * 6. Sends a response
 * 7. Handles errors
 */
app.post("/register", async (req, res) => {
    try {
        const {name, email, password} = req.body; // Extract name, email, and password from the request body
        const hashedPassword = await bcrypt.hash(password, 12); // Hash the password with a salt round of 12

        const user = new User({
            name,
            email,
            password: hashedPassword // Store the hashed password
        });
        await user.save();  // Save the user to the database
        res.status(201).send("User registered successfully"); // Send success response
    } catch (error) {
        console.log(error);
        res.status(500).send("Something went wrong"); // Send error response
    }
});

// Get all users endpoint
app.get("/users", async (req, res) => {
    try {
        const users = await User.find().select("-password"); // Fetch all users excluding the password field
        res.send(users); // Send the users as response
    } catch (error) {
        console.log(error);
    }
});

// Middleware to authenticate JWT token
const authenticate = (req, res, next) => {
    const authHeader = req.header('Authorization'); // Get the Authorization header
    if (!authHeader) {
        return res.status(401).send('Access denied. No token provided.'); // If no token, send 401 response
    }

    const token = authHeader.replace('Bearer ', ''); // Remove 'Bearer ' prefix from the token
    try {
        const decoded = jwt.verify(token, secret); // Verify the token
        req.user = decoded; // Attach decoded token to request object
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        res.status(400).send('Invalid token'); // If token is invalid, send 400 response
    }
};

// Protected route
app.get('/protected', authenticate, (req, res) => {
    res.send('This is a protected route'); // Send response for protected route
});

/**
 * Login endpoint
 * 1. Accepts POST request
 * 2. Expects email, password in the request body
 * 3. Finds the user with the given email
 * 4. Compares the password
 * 5. Generates a token
 * 6. Sends the token
 * 7. Handles errors
 */
app.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body; // Extract email and password from the request body
        const user = await User.findOne({email}); // Find user by email
        if (!user) {
            return res.status(400).send("Invalid credentials"); // If user not found, send 400 response
        }

        const isMatch = await bcrypt.compare(password, user.password); // Compare the password
        if (!isMatch) {
            return res.status(400).send("Invalid credentials"); // If password doesn't match, send 400 response
        }
        const token = jwt.sign({userId: user._id}, secret); // Generate JWT token
        res.send({token}); // Send the token as response
    } catch (error) {
        console.log(error);
        res.status(500).send("Something went wrong"); // Send error response
    }
});

// Start the server
app.listen(3000, () => {
    console.log("Server is listening.."); // Log that the server is running
});