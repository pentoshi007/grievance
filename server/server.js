// This line imports the Express.js framework, which is a minimal and flexible Node.js web application framework.
const express = require('express');

// This line imports the Mongoose library, which is an ODM (Object Data Modeling) library for MongoDB and Node.js.
const mongoose = require('mongoose');

// This line imports the dotenv library, which loads environment variables from a .env file into process.env.
const dotenv = require('dotenv');

// This line imports the cors library, which is a Node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
const cors = require('cors');

// This line imports the 'path' module, a built-in Node.js utility for working with file and directory paths.
// It will be used to correctly construct paths to the static files of the frontend build.
const path = require('path');

// This line calls the config method on dotenv, which loads the .env file (by default, it looks for a file named .env in the root directory).
// It populates process.env with the variables defined in your .env file.
dotenv.config();

// This line creates an instance of the Express application.
// The app object conventionally denotes the Express application.
const app = express();

// This line applies the CORS middleware to your Express application.
// This allows your server to accept requests from different origins (e.g., your React frontend).
app.use(cors());

// This line adds a middleware to parse incoming requests with JSON payloads.
// It is based on body-parser and allows you to access request data in req.body.
app.use(express.json());

// This line retrieves the MongoDB connection URI from the environment variables.
// It's good practice to store sensitive information like database credentials in environment variables.
const MONGO_URI = process.env.MONGO_URI;

// This line retrieves the port number from the environment variables.
// If process.env.PORT is not set, it defaults to 5001.
const PORT = process.env.PORT || 5001;

// This is an asynchronous function to connect to the MongoDB database.
const connectDB = async () => {
    // This block attempts to execute code that might throw an error.
    try {
        // This line attempts to connect to MongoDB using the URI stored in MONGO_URI.
        // mongoose.connect returns a Promise.
        await mongoose.connect(MONGO_URI);
        // If the connection is successful, this line logs a message to the console.
        console.log('MongoDB Connected Successfully!');
    } catch (error) {
        // If an error occurs during the connection attempt, this block is executed.
        // This line logs the error message to the console.
        console.error('MongoDB Connection Failed:', error.message);
        // This line exits the Node.js process with an error code (1).
        // This is often done to indicate that the application failed to start correctly.
        process.exit(1);
    }
};

// This line calls the connectDB function to establish the database connection when the server starts.
connectDB();

// This line imports the grievance routes we defined in ./routes/grievanceRoutes
// These routes handle all API endpoints related to grievances (e.g., creating, fetching).
const grievanceRoutes = require('./routes/grievanceRoutes');

// --- API Routes --- 
// All API routes are prefixed with /api
app.use('/api/grievances', grievanceRoutes);

// --- Production Build Serving Logic --- 
// This block checks if the Node environment is set to 'production'.
// This is a common way to differentiate between development and production behavior.
if (process.env.NODE_ENV === 'production') {
    // This line tells Express to serve static files (like CSS, JS, images) 
    // from the 'dist' directory inside the 'client' folder.
    // path.resolve constructs an absolute path to where the React app will be built.
    // __dirname gives the directory of the current module (server.js), 
    // then we go up one level ('..') to the project root, then into 'client/dist'.
    app.use(express.static(path.resolve(__dirname, '..', 'client', 'dist')));

    // This is a catch-all route handler.
    // It serves the 'index.html' file from the client's build directory 
    // for any GET request that doesn't match an API route or a static file defined above.
    // This is crucial for single-page applications (SPAs) like React apps, 
    // as it allows client-side routing to handle different paths.
    app.get('*', (req, res) =>
        res.sendFile(path.resolve(__dirname, '..', 'client', 'dist', 'index.html'))
    );
} else {
    // In development, the root path ('/') just sends a welcome message for the API.
    // The React app is served by its own dev server (Vite on port 3000).
    app.get('/', (req, res) => {
        res.json({ message: "Welcome to Anuhya's Heartfelt Grievance Portal API (Development Mode)" });
    });
}

// This line starts the Express server and makes it listen for incoming requests on the specified port.
// The callback function is executed once the server has successfully started.
app.listen(PORT, () => {
    // This line logs a message to the console indicating that the server is running and on which port.
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
}); 