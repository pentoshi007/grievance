# Anuhya's Heartfelt Grievance Portal ❤️

A MERN stack application designed for Anuhya to submit her grievances to Aniket, built with love and a modern, responsive UI.

## Features

- Secret code word entry to access the portal.
- Glassmorphism UI design for a modern, elegant feel.
- Responsive design for optimal viewing on desktop, tablet, and mobile devices.
- Grievance submission form with fields for:
  - Title
  - Description
  - Mood (selectable emojis with an "Other" option for custom input)
  - Severity (selectable quirky/loving options with an "Other" option for custom input)
- Personalized "Thank You" page after submission.
- Backend built with Node.js, Express, and MongoDB (Mongoose).
- Frontend built with React (using Vite).

## Project Structure

```
grievance/
├── client/         # React frontend application
│   ├── public/     # Static assets for client (e.g., favicon)
│   │   ├── assets/     # Images, SVGs etc.
│   │   ├── components/ # Reusable React components (GrievanceForm, ThankYou)
│   │   ├── App.jsx     # Main application component (handles auth, routing logic)
│   │   ├── App.module.css # Styles for App.jsx
│   │   ├── index.css   # Global CSS styles
│   │   └── main.jsx    # Entry point for React app
│   ├── .eslintrc.cjs # ESLint configuration
│   ├── index.html    # Main HTML page for React app
│   ├── package.json  # Frontend dependencies and scripts
│   └── vite.config.js # Vite configuration (proxy, port)
├── server/         # Node.js/Express backend application
│   ├── controllers/  # Logic for handling API requests (grievanceController.js)
│   ├── models/       # Mongoose schemas (Grievance.js)
│   ├── routes/       # API route definitions (grievanceRoutes.js)
│   ├── .env          # Environment variables (MONGO_URI, JWT_SECRET, PORT) - MUST BE CREATED MANUALLY
│   ├── package.json  # Backend dependencies and scripts
│   └── server.js     # Main backend server file (Express setup, DB connection, serves client in prod)
└── README.md       # This file
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v14.x or later recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js) or [Yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/try/download/community) (or a MongoDB Atlas account for a cloud-hosted database)

## Setup and Installation

1.  **Clone the repository (if applicable) or download the project files.**

2.  **Backend Setup (`server` directory):**

    - Navigate to the `server` directory:
      ```bash
      cd server
      ```
    - Create a `.env` file in the `server` directory. Copy the contents of `.env.example` (if provided) or add the following, replacing placeholders with your actual values:
      ```env
      MONGO_URI="your_mongodb_connection_string"
      JWT_SECRET="your_super_secret_jwt_key_that_is_long_and_random" # Important for security
      PORT=5001
      # NODE_ENV=development # Optional: set to 'production' when deploying
      ```
      _Replace `your_mongodb_connection_string` with your actual MongoDB connection string (e.g., from MongoDB Atlas)._
      _Replace `your_super_secret_jwt_key_that_is_long_and_random` with a unique, strong secret._
    - Install backend dependencies:
      ```bash
      npm install
      # OR
      # yarn install
      ```

3.  **Frontend Setup (`client` directory):**
    - Navigate to the `client` directory from the project root:
      ```bash
      cd ../client
      # or if you are at the root: cd client
      ```
    - Install frontend dependencies:
      ```bash
      npm install
      # OR
      # yarn install
      ```

## Running the Application (Development Mode)

1.  **Start the Backend Server:**

    - In the `server` directory, run:
      ```bash
      npm run dev
      # This uses nodemon for auto-restarts. Server will typically run on http://localhost:5001
      ```

2.  **Start the Frontend Development Server:**

    - In a **new terminal window/tab**, navigate to the `client` directory and run:
      ```bash
      npm run dev
      # This uses Vite. Client will typically run on http://localhost:3000
      ```

3.  **Access the Application:**
    - Open your browser and go to `http://localhost:3000`.

## Building and Running for Production

1.  **Build the React Frontend:**

    - In the `client` directory, run:
      ```bash
      npm run build
      # This will create an optimized build in the `client/dist` folder.
      ```

2.  **Run the Backend Server in Production Mode:**
    - Ensure your `server/.env` file is correctly configured for your production database if it's different from development.
    - Set the `NODE_ENV` environment variable to `production`.
      - **Option 1 (in `.env` file):** Add `NODE_ENV=production` to your `server/.env` file.
      - **Option 2 (command line):** When starting the server, prefix the command:
        ```bash
        NODE_ENV=production npm start
        # or for yarn:
        # NODE_ENV=production yarn start
        ```
    - In the `server` directory, start the server using the standard start script (which typically uses `node server.js`):
      ```bash
      npm start
      ```
    - The Express server will now serve the built React app from `client/dist` along with handling API requests. Access the application at the server's URL (e.g., `http://localhost:5001` or your deployment URL).


---

Built with ❤️ for Anuhya.
