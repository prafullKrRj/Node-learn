// Import the 'express' module, which is a minimalist web framework for Node.js
// It simplifies the process of creating a web server and handling HTTP requests.
const express = require("express");

// Import the 'students' module, which is assumed to be a local module named 'Students.js'
// This module likely exports some data (an array or object) related to students.
const students = require("./Students");

// Create an instance of an Express application. This instance is used to define routes
// and middleware for handling HTTP requests.
const app = express();

// Define a middleware function that will be executed for every incoming request to the server.
// Middleware functions have access to the request object (req), the response object (res),
// and a function to pass control to the next middleware (next).
app.use((req, res, next) => {
    // Log a message to the console whenever a request is received.
    console.log("Logging Middleware");

    // Log the URL of the incoming request to the console.
    console.log(req.url);

    // Call the 'next()' function to pass control to the next middleware in the stack.
    // Without calling 'next()', the request would be left hanging and never reach its intended route.
    next();
});

// Use the built-in 'express.json()' middleware to automatically parse JSON payloads in incoming requests.
// This allows us to access the JSON data from the request body using 'req.body'.
app.use(express.json());

// Define a GET route that matches the URL pattern '/user/:id'.
// The ':id' part is a route parameter, meaning it can be any value and will be accessible via 'req.params.id'.
app.get('/user/:id', (req, res) => {
    // Extract the 'id' parameter from the request URL.
    const userId = req.params.id;

    // Send a response to the client that includes the extracted 'id'.
    // The '.status(200)' method sets the status code to 200, indicating a successful request.
    res.send(`UserId: ${userId}`).status(200);
});

// Define a GET route that matches the URL '/search'.
// The 'request.query.q' expression extracts the query parameter 'q' from the request URL.
app.get('/search', (request, result) => {
    // Extract the 'q' query parameter from the request URL.
    const query = request.query.q;

    // Send a response to the client that includes the extracted query parameter.
    result.send(`Your Query ${query}`);
});

// Define a POST route that matches the URL '/data'.
// This route doesn't currently process any incoming data, it simply sends a response.
app.post('/data', (req, res) => {
    // Send a simple response to the client when this route is accessed.
    res.send("Data page");
});

// Define a POST route that matches the URL '/submit'.
// This route processes incoming data sent in the request body, specifically 'name' and 'email'.
app.post('/submit', (req, res) => {
    // Destructure 'name' and 'email' from the request body.
    const { name, email } = req.body;

    // Send a response to the client that includes the extracted 'name' and 'email'.
    res.send(`Name: ${name}, Mail: ${email}`);
});

// Define a GET route that matches the URL '/students'.
// This route responds with a JSON object containing the list of students.
app.get('/students', (req, res) => {
    // Send the 'students' object as a JSON response with a status code of 200 (OK).
    res.status(200).json(students);
});

// Start the Express server and have it listen on port 3000.
// The callback function is executed once the server starts successfully.
app.listen(3000, () => {
    // Log a message to the console indicating that the server is listening on port 3000.
    console.log("Listening");
});