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

// Configure Express to trust proxies - CRITICAL for real IP capture
// This enables req.ip to work properly behind proxies, load balancers, and hosting platforms
// Setting to true means trust all proxies (use specific proxy count in production if known)
app.set('trust proxy', true);

// Alternative more specific configurations (uncomment one if needed):
// app.set('trust proxy', 1); // Trust first proxy
// app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal']); // Trust specific ranges
// app.set('trust proxy', 'loopback'); // Trust only loopback

// Additional Express settings for better IP detection
app.set('x-powered-by', false); // Remove Express signature for security
app.set('case sensitive routing', true);
app.set('strict routing', false);

// Environment-specific proxy trust settings
if (process.env.NODE_ENV === 'production') {
    // In production, be more specific about trusted proxies if you know them
    if (process.env.TRUSTED_PROXY_COUNT) {
        app.set('trust proxy', parseInt(process.env.TRUSTED_PROXY_COUNT));
        console.log(`Trusting ${process.env.TRUSTED_PROXY_COUNT} proxy(ies) in production`);
    }
} else {
    // In development, trust all proxies for testing
    console.log('Development mode: Trusting all proxies for IP detection');
}

// CORS configuration: Allow requests from your Vercel frontend URL
// We don't know the Vercel URL yet, so we'll allow all for now, or you can add a placeholder.
// For production, it's best to restrict this to your actual frontend domain.
const corsOptions = {
    origin: process.env.FRONTEND_URL || '*', // Use an env variable for frontend URL or allow all
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// This line adds a middleware to parse incoming requests with JSON payloads.
// It is based on body-parser and allows you to access request data in req.body.
app.use(express.json());

// Import and use IP capture middleware for aggressive IP detection
const { captureIpMiddleware, debugIpMiddleware } = require('./middleware/ipCapture');

// Use IP capture middleware globally
app.use(captureIpMiddleware);

// Use debug middleware (comment out in production)
app.use(debugIpMiddleware);

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

// --- Root Route for API --- 
// This will now be the default for the backend server.
app.get('/', (req, res) => {
    res.json({ message: "Welcome to Anuhya's Heartfelt Grievance Portal API" });
});

// This line starts the Express server and makes it listen for incoming requests on the specified port.
// The callback function is executed once the server has successfully started.
app.listen(PORT, () => {
    // This line logs a message to the console indicating that the server is running and on which port.
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
}); 