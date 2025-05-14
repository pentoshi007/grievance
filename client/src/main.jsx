// This line imports the React library, which is necessary for writing React components.
import React from 'react';

// This line imports ReactDOM from 'react-dom/client', which provides DOM-specific methods that can be used at the top level of your app.
// It's used here to render the React application into the HTML.
import ReactDOM from 'react-dom/client';

// This line imports the main App component from './App.jsx'.
// The App component is typically the root component of a React application.
import App from './App.jsx';

// This line imports the main CSS file for global styles.
// These styles will apply to the entire application.
import './index.css';

// This line uses ReactDOM.createRoot to create a new React root for the HTML element with the id 'root'.
// The getElementById('root') method finds the div in your index.html where the app will be mounted.
// createRoot enables the new concurrent rendering features in React 18.
ReactDOM.createRoot(document.getElementById('root')).render(
    // React.StrictMode is a tool for highlighting potential problems in an application.
    // It activates additional checks and warnings for its descendants.
    // It does not render any visible UI and only runs in development mode.
    <React.StrictMode>
        {/* This renders the main App component into the root. */}
        <App />
    </React.StrictMode>,
); 