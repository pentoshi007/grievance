// This line imports React, which is the library for building user interfaces.
import React from 'react';
// This line imports the CSS module specifically for styling the ThankYou component.
// CSS modules help in creating locally scoped CSS, preventing style conflicts.
import styles from './ThankYou.module.css';

// This defines the ThankYou functional component.
// It accepts three props: 
// - userName: The name of the person who submitted the grievance (e.g., "Anuhya").
// - yourName: Your name, as the recipient of the grievance (e.g., "Aniket").
// - onSubmitAnother: A function to be called when the "Submit Another" button is clicked.
const ThankYou = ({ userName, yourName, onSubmitAnother }) => {
    // The component returns JSX (JavaScript XML) to define its structure and content.
    return (
        // This div is the main container for the thank you message.
        // It uses a class from the imported CSS module for styling (e.g., glassy effect).
        <div className={styles.thankYouContainer}>
            {/* This h1 is the main thank you heading. */}
            {/* It uses a template literal to include the userName prop. */}
            {/* It also combines a general title style with a specific font style ('font-pacifico') from global CSS. */}
            <h1 className={`${styles.thankYouTitle} font-pacifico`}>
                {/* Displays the personalized thank you message. */}
                Thank you, {userName}
                {/* This span displays a heart emoji. */}
                {/* It has its own style class for potential specific emoji styling (e.g., size, alignment). */}
                <span className={styles.heartEmoji}>💖</span>
            </h1>

            {/* This paragraph is the first line of the follow-up message. */}
            <p className={styles.messageLine1}>Your grievance has been sent to</p>
            {/* This paragraph displays your name as the recipient. */}
            {/* It has a specific style to make it stand out (e.g., bolder). */}
            <p className={styles.yourNameLine}>
                {/* Displays yourName prop. */}
                {yourName}
                {/* This span displays an envelope emoji. */}
                <span className={styles.envelopeEmoji}>💌</span>
            </p>

            {/* This paragraph is the second line of the follow-up message. */}
            <p className={styles.messageLine2}>He will get back to you very soon!</p>
            {/* This paragraph is a more subtle, playful message. */}
            <p className={styles.subtleMessage}>(He will think about it)</p>

            {/* This button allows the user to go back and submit another grievance. */}
            {/* The onClick handler is set to the onSubmitAnother prop function passed from App.jsx. */}
            <button onClick={onSubmitAnother} className={styles.submitAnotherButton}>
                Submit Another
            </button>
        </div>
    );
};

// This line exports the ThankYou component, making it available for import and use in other files, such as App.jsx.
export default ThankYou; 