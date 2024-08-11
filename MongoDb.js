// Import the 'mongoose' module to interact with MongoDB
import mongoose from 'mongoose';
// Import the 'express' module to create a web server
import express from 'express';

// Create an instance of an Express application
const app = express();

// Use the built-in 'express.json()' middleware to parse JSON payloads in incoming requests
app.use(express.json());

// Connect to the MongoDB database running on localhost at port 27017
mongoose.connect('mongodb://localhost:27017/mydatabase')
    .then(r => {
        // Log a message to the console if the connection is successful
        console.log("Database Connected");
    })
    .catch(err => {
        // Log an error message to the console if the connection fails
        console.log(err);
    });

// Define a schema for the 'User' collection in MongoDB
const userSchema = new mongoose.Schema({
    // 'name' field of type String, required
    name: { type: String, required: true },
    // 'email' field of type String, required and unique
    email: { type: String, required: true, unique: true },
    // 'age' field of type Number, optional
    age: Number,
    // 'createdAt' field of type Date, with a default value of the current date and time
    createdAt: { type: Date, default: Date.now }
});

// Create a model for the 'User' schema
const User = mongoose.model('User', userSchema);

// Define a POST route to add a new user
app.post('/users/add', async (req, res) => {
    try {
        // Create a new user instance with the data from the request body
        const user = new User(req.body);
        // Save the user to the database
        await user.save()
            .then(() => {
                // Send a success message if the document is saved
                res.send("Document Saved");
            })
            .catch(err => {
                // Send a 404 error if there is an error saving the document
                res.status(404).send(err);
            });
    } catch (err) {
        // Send a 400 error if there is a general error
        res.status(400).send(err);
    }
});

// Define a GET route to retrieve all users
app.get('/users/all', async (req, res) => {
    try {
        // Find all user documents in the database
        const users = await User.find();
        // Send the list of users as the response
        res.send(users);
    } catch (err) {
        // Send a 400 error if there is an error retrieving the users
        res.status(400).send(err);
    }
});

// Define a PUT route to update a user by ID
app.put('/users/update/:id', async (req, res) => {
    try {
        // Find a user by ID and update it with the data from the request body
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            // Return the updated document
            new: true,
            // Run the model validators on the update
            runValidators: true
        });
        // If the user is not found, send a 404 error
        if (!user) return res.status(404).send('User not found');
        // Send the updated user as the response
        res.send(user);
    } catch (err) {
        // Send a 400 error if there is an error updating the user
        res.status(400).send(err);
    }
});

// Define a DELETE route to delete a user by ID
app.delete('/users/delete/:id', async (req, res) => {
    try {
        // Find a user by ID and delete it
        const user = await User.findByIdAndDelete(req.params.id);
        // If the user is not found, send a 404 error
        if (!user) return res.status(404).send('User not found');
        // Send the deleted user as the response
        res.send(user);
    } catch (err) {
        // Send a 400 error if there is an error deleting the user
        res.status(400).send(err);
    }
});

// Start the Express server and listen on port 3000
app.listen(3000, () => {
    // Log a message to the console indicating that the server is running
    console.log("Server is listening...");
});