import mongoose from "mongoose";
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/jwtPrac")
    .then(() => {
        console.log("Connected to MongoDB")
    }).catch((err) => {
    console.log(err)
})

// User schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

// User model
const User = mongoose.model("User", userSchema)

// Register endpoint
app.post("/register", async (req, res) => {
    try {
        const {name, email, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = new User({
            name,
            email,
            password: hashedPassword
        });
        await user.save();
        res.status(201).send("User registered successfully");
    } catch (error) {
        console.log(error);
        res.status(500).send("Something went wrong");
    }
});
app.get("/users", async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.send(users);
    } catch (error) {
        console.log(error);
    }
})
// Login endpoint
app.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).send("Invalid credentials");
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send("Invalid credentials");
        }
        const token = jwt.sign({userId: user._id}, 'xyz', {
            expiresIn: '1h'
        });
        res.send({token});
    } catch (error) {
        console.log(error);
        res.status(500).send("Something went wrong");
    }
});

// Start the server
app.listen(3000, () => {
    console.log("Server is listening..");
});