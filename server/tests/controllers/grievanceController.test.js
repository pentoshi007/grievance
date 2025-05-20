// Import the function to be tested
const { createGrievance } = require('../../controllers/grievanceController');
// Mock the Grievance model
const Grievance = require('../../models/Grievance');

// Mock the Grievance model and its save method
jest.mock('../../models/Grievance');

describe('Grievance Controller - createGrievance', () => {
    let mockReq;
    let mockRes;

    beforeEach(() => {
        // Reset mocks for each test
        jest.clearAllMocks();

        // Mock request object
        mockReq = {
            body: {},
            ip: '127.0.0.1', // Default IP for all tests unless overridden
        };

        // Mock response object with spies for status and json methods
        mockRes = {
            status: jest.fn().mockReturnThis(), // Allows chaining .json()
            json: jest.fn(),
        };
    });

    test('should create a grievance with IP address and geolocation when provided', async () => {
        // Mock request body for this specific test
        mockReq.body = {
            title: 'Test Grievance with Geo',
            description: 'This is a test description with geolocation.',
            mood: 'Neutral',
            severity: 'Low',
            latitude: '12.345',
            longitude: '67.890',
        };

        const mockSavedGrievance = {
            _id: 'someMongoId',
            title: mockReq.body.title,
            description: mockReq.body.description,
            mood: mockReq.body.mood,
            severity: mockReq.body.severity,
            ipAddress: mockReq.ip,
            geolocation: {
                latitude: mockReq.body.latitude,
                longitude: mockReq.body.longitude,
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        // Mock the Grievance constructor and save method
        const mockGrievanceInstance = {
            save: jest.fn().mockResolvedValue(mockSavedGrievance),
        };
        Grievance.mockImplementation(() => mockGrievanceInstance);

        // Call the controller function
        await createGrievance(mockReq, mockRes);

        // Assertions
        expect(Grievance).toHaveBeenCalledTimes(1);
        expect(Grievance).toHaveBeenCalledWith({
            title: mockReq.body.title,
            description: mockReq.body.description,
            mood: mockReq.body.mood,
            severity: mockReq.body.severity,
            ipAddress: mockReq.ip,
            geolocation: {
                latitude: mockReq.body.latitude,
                longitude: mockReq.body.longitude,
            },
        });
        expect(mockGrievanceInstance.save).toHaveBeenCalledTimes(1);
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith(mockSavedGrievance);
    });

    test('should create a grievance with IP address and null geolocation when latitude and longitude are not provided', async () => {
        // Mock request body for this specific test (no latitude/longitude)
        mockReq.body = {
            title: 'Test Grievance without Geo',
            description: 'This is a test description without geolocation.',
            mood: 'Calm',
            severity: 'Medium',
        };
        // ip is already set in beforeEach

        const mockSavedGrievance = {
            _id: 'anotherMongoId',
            title: mockReq.body.title,
            description: mockReq.body.description,
            mood: mockReq.body.mood,
            severity: mockReq.body.severity,
            ipAddress: mockReq.ip,
            geolocation: {
                latitude: null, // As per controller logic
                longitude: null, // As per controller logic
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        // Mock the Grievance constructor and save method
        const mockGrievanceInstance = {
            save: jest.fn().mockResolvedValue(mockSavedGrievance),
        };
        Grievance.mockImplementation(() => mockGrievanceInstance);

        // Call the controller function
        await createGrievance(mockReq, mockRes);

        // Assertions
        expect(Grievance).toHaveBeenCalledTimes(1);
        expect(Grievance).toHaveBeenCalledWith({
            title: mockReq.body.title,
            description: mockReq.body.description,
            mood: mockReq.body.mood,
            severity: mockReq.body.severity,
            ipAddress: mockReq.ip,
            geolocation: {
                latitude: null, // Controller sets to null if undefined
                longitude: null, // Controller sets to null if undefined
            },
        });
        expect(mockGrievanceInstance.save).toHaveBeenCalledTimes(1);
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith(mockSavedGrievance);
    });

    test('should return 400 if grievance creation fails', async () => {
        mockReq.body = {
            title: 'Bad Grievance',
            // Missing description to cause a potential validation error or generic save error
        };

        const errorMessage = 'Database error';
        const mockGrievanceInstance = {
            save: jest.fn().mockRejectedValue(new Error(errorMessage)),
        };
        Grievance.mockImplementation(() => mockGrievanceInstance);

        await createGrievance(mockReq, mockRes);

        expect(Grievance).toHaveBeenCalledTimes(1);
        expect(mockGrievanceInstance.save).toHaveBeenCalledTimes(1);
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            message: 'Error creating grievance',
            error: errorMessage,
        });
    });
});
