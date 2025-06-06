// This line imports the Grievance model from the ../Grievance.js file.
// The Grievance model is used to interact with the 'grievances' collection in MongoDB.
const Grievance = require('../Grievance');
const axios = require('axios');

// Import IP utilities for aggressive IP address extraction
const { getRealIpAddress, getIpInfo, forceRealIp } = require('../../utils/ipUtils');

// This is an asynchronous function to handle the creation of a new grievance.
// It's an Express route handler, so it takes 'req' (request) and 'res' (response) objects as arguments.
const createGrievance = async (req, res) => {
    // This line destructures the title, description, mood, severity, latitude, and longitude from the request body (req.body).
    // These are the details of the grievance submitted by the user.
    let { title, description, mood, severity, latitude, longitude } = req.body;

    // Get the real IP address using most aggressive method
    const ipAddress = req.realIp || forceRealIp(req);

    // Log IP info for this grievance creation
    console.log('Creating grievance with FORCED IP:', ipAddress, 'Full info:', req.ipInfo);

    let ipLat = null;
    let ipLon = null;

    if ((!latitude || !longitude) && ipAddress) {
        console.log(`Client geolocation not provided or incomplete, attempting IP geolocation for IP: ${ipAddress}`);
        const apiUrl = `http://ip-api.com/json/${ipAddress}?fields=status,message,lat,lon`;
        try {
            const response = await axios.get(apiUrl);
            if (response.data && response.data.status === 'success' && response.data.lat && response.data.lon) {
                ipLat = response.data.lat;
                ipLon = response.data.lon;
                console.log(`IP geolocation successful for ${ipAddress}: Lat: ${ipLat}, Lon: ${ipLon}`);
            } else {
                console.error(`IP geolocation failed for ${ipAddress}: ` + (response.data ? response.data.message : "No response data"));
            }
        } catch (error) {
            console.error(`Error during IP geolocation API call for IP ${ipAddress}: ` + error.message);
        }
    }

    // This block attempts to execute code that might throw an error (e.g., database operation failure).
    try {
        // This line creates a new Grievance document using the data received in the request body.
        // It includes the new ipAddress and geolocation fields, prioritizing client-provided data.
        const newGrievance = new Grievance({
            title,
            description,
            mood,
            severity,
            ipAddress, // Store the extracted IP address
            geolocation: {
                latitude: latitude || ipLat || null,
                longitude: longitude || ipLon || null
            }
        });

        // This line saves the newly created grievance document to the MongoDB database.
        // The save() method is asynchronous and returns a Promise.
        const savedGrievance = await newGrievance.save();

        // Log successful IP capture
        console.log(`Grievance created successfully with IP: ${ipAddress}`);

        // If the grievance is saved successfully, this line sends a 201 (Created) HTTP status code and the saved grievance object as a JSON response.
        res.status(201).json(savedGrievance);
    } catch (error) {
        // Log error with IP info for debugging
        console.error('Error creating grievance:', error.message, 'IP:', ipAddress);

        // If an error occurs during the process (e.g., validation error, database error), this block is executed.
        // This line sends a 400 (Bad Request) HTTP status code and an error message as a JSON response.
        // It includes the error.message to provide more details about what went wrong.
        res.status(400).json({ message: 'Error creating grievance', error: error.message });
    }
};

// This is an asynchronous function to handle fetching all grievances.
// It's an Express route handler, taking 'req' (request) and 'res' (response) objects.
const getGrievances = async (req, res) => {
    // This block attempts to execute code that might throw an error.
    try {
        // This line fetches all documents from the 'grievances' collection.
        // Grievance.find({}) with an empty object as a filter means "find all".
        // The .sort({ createdAt: -1 }) part sorts the grievances by their creation date in descending order (newest first).
        const grievances = await Grievance.find({}).sort({ createdAt: -1 });

        // If grievances are fetched successfully, this line sends a 200 (OK) HTTP status code and the array of grievances as a JSON response.
        res.status(200).json(grievances);
    } catch (error) {
        // If an error occurs during fetching, this block is executed.
        // This line sends a 500 (Internal Server Error) HTTP status code and an error message as a JSON response.
        res.status(500).json({ message: 'Error fetching grievances', error: error.message });
    }
};

// This line exports the createGrievance and getGrievances functions.
// This makes them available to be imported and used in other files, specifically in our routes file.
module.exports = {
    createGrievance,
    getGrievances
}; 