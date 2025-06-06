// This line imports the Mongoose library, which is used for MongoDB object modeling.
const mongoose = require('mongoose');

// This line gets the Schema constructor from Mongoose.
// A Mongoose schema defines the structure of the document, default values, validators, etc.
const Schema = mongoose.Schema;

// This line defines the schema for a Grievance.
// It specifies the fields that each grievance document will have, their types, and any constraints.
const grievanceSchema = new Schema({
    // The 'title' field for the grievance.
    // It is of type String and is required (must be provided).
    // The trim option removes whitespace from the beginning and end of the string.
    title: {
        type: String,
        required: true,
        trim: true
    },
    // The 'description' field for the grievance.
    // It is of type String and is required.
    // The trim option removes whitespace.
    description: {
        type: String,
        required: true,
        trim: true
    },
    // The 'mood' field for the grievance.
    // It is of type String. We can define specific allowed values (enum) later if needed, or handle it on the frontend.
    // It is not required by default, allowing for flexibility.
    mood: {
        type: String,
        trim: true
    },
    // The 'severity' field for the grievance.
    // It is of type String. Similar to mood, specific values can be enforced later or managed by the frontend.
    // It is not required by default.
    severity: {
        type: String,
        trim: true
    },
    // The 'ipAddress' field to store the client's IP address
    // This captures the real IP address of the user submitting the grievance
    ipAddress: {
        type: String,
        required: true,
        trim: true
    },
    // The 'geolocation' field for the grievance.
    // It stores the latitude and longitude of the user.
    geolocation: {
        type: Object,
        properties: {
            latitude: {
                type: String,
                trim: true
            },
            longitude: {
                type: String,
                trim: true
            }
        }
    }
}, {
    // The 'timestamps' option.
    // If set to true, Mongoose automatically adds two fields to the schema: createdAt and updatedAt.
    // createdAt: a date representing when this document was created.
    // updatedAt: a date representing when this document was last updated.
    timestamps: true
});

// This line creates a Mongoose model named 'Grievance' based on the grievanceSchema.
// Mongoose models are constructors compiled from Schema definitions. An instance of a model is called a document.
// Models are responsible for creating and reading documents from the underlying MongoDB database.
// The first argument is the singular name of the collection your model is for. Mongoose automatically looks for the plural, lowercased version of your model name.
// Thus, for the model 'Grievance', Mongoose will use the collection 'grievances'.
const Grievance = mongoose.model('Grievance', grievanceSchema);

// This line exports the Grievance model, making it available for use in other parts of the application (e.g., in our route handlers).
module.exports = Grievance; 