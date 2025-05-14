// This line imports the Express.js framework.
const express = require('express');

// This line imports the controller functions for grievances.
// These functions (createGrievance, getGrievances) contain the logic for handling requests related to grievances.
const { createGrievance, getGrievances } = require('../controllers/grievanceController');

// This line creates a new router object.
// An Express router is like a mini-application, capable only of performing middleware and routing functions.
const router = express.Router();

// This line defines a route for HTTP POST requests to the root path ('/') of this router.
// When a POST request is made to '/api/grievances/' (assuming this router is mounted at '/api/grievances'), the createGrievance controller function will be executed.
// This route is typically used for creating a new grievance.
router.post('/', createGrievance);

// This line defines a route for HTTP GET requests to the root path ('/') of this router.
// When a GET request is made to '/api/grievances/', the getGrievances controller function will be executed.
// This route is typically used for fetching all existing grievances.
router.get('/', getGrievances);

// This line exports the router object.
// This makes the configured router available to be imported and used in the main server file (e.g., server.js) to handle specific path prefixes.
module.exports = router; 