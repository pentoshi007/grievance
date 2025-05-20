import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './GrievanceForm.module.css';

// Define options for Mood dropdown
const moodOptions = [
    { value: '', label: 'Select a mood...', emoji: '🤔' },
    { value: 'Happy 😊', label: 'Happy 😊', emoji: '😊' },
    { value: 'Sad 😢', label: 'Sad 😢', emoji: '😢' },
    { value: 'Angry 😠', label: 'Angry 😠', emoji: '😠' },
    { value: 'Playful 😜', label: 'Playful 😜', emoji: '😜' },
    { value: 'Anxious 😟', label: 'Anxious 😟', emoji: '😟' },
    { value: 'Loved 🥰', label: 'Loved 🥰', emoji: '🥰' },
    { value: 'other_mood', label: 'Other...', emoji: '✍️' }
];

// Define options for Severity dropdown
const severityOptions = [
    { value: '', label: 'How bad is it?...' },
    { value: 'Just a tiny whisper 🤏', label: 'Just a tiny whisper 🤏' },
    { value: 'Needs a little attention 👀', label: 'Needs a little attention 👀' },
    { value: 'A chunky KitKat would fix this 🍫', label: 'A chunky KitKat would fix this 🍫' }, // Example from user
    { value: 'Code Red! Major meltdown! 🌋', label: 'Code Red! Major meltdown! 🌋' },
    { value: 'Send cuddles & snacks, stat! 🤗🍪', label: 'Send cuddles & snacks, stat! 🤗🍪' },
    { value: 'I\'m fine... (Narrator: She was not fine) 🥲', label: 'I\'m fine... (Narrator: She was not fine) 🥲' },
    { value: 'other_severity', label: 'Other...' }
];

const GrievanceForm = ({ onFormSubmitSuccess }) => {
    // formData now stores the final values to be sent to the backend
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        mood: '',
        severity: ''
    });

    // State for selected mood/severity from dropdown (can be 'other_mood' or 'other_severity')
    const [selectedMoodValue, setSelectedMoodValue] = useState('');
    const [selectedSeverityValue, setSelectedSeverityValue] = useState('');

    // State for custom text input if 'Other' is selected
    const [customMoodText, setCustomMoodText] = useState('');
    const [customSeverityText, setCustomSeverityText] = useState('');

    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [isFetchingLocation, setIsFetchingLocation] = useState(false); // State for geolocation fetching

    // Define the base API URL from the environment variable
    // In development, if VITE_APP_API_URL is not set, it will default to an empty string,
    // so API calls will hit the proxy (e.g., /api/grievances).
    // In production, VITE_APP_API_URL will be the deployed backend URL.
    const API_URL = import.meta.env.VITE_APP_API_URL || '';

    // Effect to update formData.mood when selectedMoodValue or customMoodText changes
    useEffect(() => {
        if (selectedMoodValue === 'other_mood') {
            setFormData(prev => ({ ...prev, mood: customMoodText }));
        } else {
            setFormData(prev => ({ ...prev, mood: selectedMoodValue }));
        }
    }, [selectedMoodValue, customMoodText]);

    // Effect to update formData.severity when selectedSeverityValue or customSeverityText changes
    useEffect(() => {
        if (selectedSeverityValue === 'other_severity') {
            setFormData(prev => ({ ...prev, severity: customSeverityText }));
        } else {
            setFormData(prev => ({ ...prev, severity: selectedSeverityValue }));
        }
    }, [selectedSeverityValue, customSeverityText]);

    // Generic handler for title and description text inputs
    const handleTextChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handler for mood dropdown change
    const handleMoodSelectChange = (e) => {
        setSelectedMoodValue(e.target.value);
        if (e.target.value !== 'other_mood') {
            setCustomMoodText(''); // Clear custom text if a predefined mood is chosen
        }
    };

    // Handler for severity dropdown change
    const handleSeveritySelectChange = (e) => {
        setSelectedSeverityValue(e.target.value);
        if (e.target.value !== 'other_severity') {
            setCustomSeverityText(''); // Clear custom text if a predefined severity is chosen
        }
    };

    // Handlers for custom text inputs
    const handleCustomMoodChange = (e) => setCustomMoodText(e.target.value);
    const handleCustomSeverityChange = (e) => setCustomSeverityText(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Don't set local message anymore, App.jsx will handle navigation
        // setMessage(''); 
        // setIsSuccess(false);

        if (!formData.title || !formData.description) {
            // Still show local validation messages if needed, or handle them differently
            setMessage('Please fill out both Title and What\'s bothering you?');
            setIsSuccess(false); // Keep this to style the local message if it appears
            return;
        }

        // Ensure mood and severity have values if they are not 'other' and no custom text is there yet
        // Or if they are required fields generally
        if (!formData.mood && selectedMoodValue !== 'other_mood' && selectedMoodValue) {
            // This condition might be too complex or not needed if useEffect handles it well
        }
        if (!formData.severity && selectedSeverityValue !== 'other_severity' && selectedSeverityValue) {
            // Same as above
        }

        setIsFetchingLocation(true);
        let locationData = null;

        if (navigator.geolocation) {
            try {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject);
                });
                locationData = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                };
            } catch (error) {
                console.error("Error getting geolocation:", error);
                // Proceed without location data, locationData remains null
            }
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
        setIsFetchingLocation(false);

        const submissionData = { ...formData };
        if (locationData) {
            submissionData.latitude = locationData.latitude;
            submissionData.longitude = locationData.longitude;
        }

        try {
            // Use the API_URL prefix for the request
            // The path becomes `${API_URL}/api/grievances`
            await axios.post(`${API_URL}/api/grievances`, submissionData);
            // Clear form and local states
            setFormData({ title: '', description: '', mood: '', severity: '' });
            setSelectedMoodValue('');
            setSelectedSeverityValue('');
            setCustomMoodText('');
            setCustomSeverityText('');
            setMessage(''); // Clear any local validation messages
            setIsSuccess(false); // Reset local success flag

            // Call the callback to notify App.jsx of successful submission
            if (onFormSubmitSuccess) {
                onFormSubmitSuccess();
            }
        } catch (error) {
            // Handle submission error locally within the form if desired
            setMessage('Oh no! Something went wrong. Please try again. (' + (error.response?.data?.message || error.message) + ')');
            setIsSuccess(false);
            console.error('Error submitting grievance:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.grievanceForm}>
            <h2 className={`${styles.formTitle} font-pacifico`}>Submit a Grievance</h2>

            <div className={styles.formGroup}>
                <label htmlFor="title" className={styles.label}>Title</label>
                <input
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={handleTextChange}
                    placeholder="What shall we call this episode?"
                    className={styles.inputField}
                    disabled={isFetchingLocation}
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="description" className={styles.label}>What's bothering you?</label>
                <textarea
                    name="description"
                    id="description"
                    value={formData.description}
                    onChange={handleTextChange}
                    placeholder="Pour your heart out... or just vent a little."
                    className={styles.textareaField}
                    rows="4"
                    disabled={isFetchingLocation}
                />
            </div>

            {/* Mood Selection */}
            <div className={styles.formGroup}>
                <label htmlFor="mood" className={styles.label}>Mood</label>
                <select
                    name="mood"
                    id="mood"
                    value={selectedMoodValue}
                    onChange={handleMoodSelectChange}
                    className={styles.selectField}
                    disabled={isFetchingLocation}
                >
                    {moodOptions.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {selectedMoodValue === 'other_mood' && (
                    <input
                        type="text"
                        name="customMoodText"
                        value={customMoodText}
                        onChange={handleCustomMoodChange}
                        placeholder="Describe the mood..."
                        className={`${styles.inputField} ${styles.customInputField}`}
                        disabled={isFetchingLocation}
                    />
                )}
            </div>

            {/* Severity Selection */}
            <div className={styles.formGroup}>
                <label htmlFor="severity" className={styles.label}>Severity</label>
                <select
                    name="severity"
                    id="severity"
                    value={selectedSeverityValue}
                    onChange={handleSeveritySelectChange}
                    className={styles.selectField}
                    disabled={isFetchingLocation}
                >
                    {severityOptions.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {selectedSeverityValue === 'other_severity' && (
                    <input
                        type="text"
                        name="customSeverityText"
                        value={customSeverityText}
                        onChange={handleCustomSeverityChange}
                        placeholder="Describe the severity..."
                        className={`${styles.inputField} ${styles.customInputField}`}
                        disabled={isFetchingLocation}
                    />
                )}
            </div>

            <button type="submit" className={styles.submitButton} disabled={isFetchingLocation}>
                {isFetchingLocation ? 'Fetching location...' : 'Submit ❤️'}
            </button>

            {/* This message will now primarily show validation errors or if the submission itself fails */}
            {message && (
                <p className={`${styles.submissionMessage} ${isSuccess ? styles.successMessage : styles.errorMessage}`}>
                    {message}
                </p>
            )}
        </form>
    );
};

export default GrievanceForm; 