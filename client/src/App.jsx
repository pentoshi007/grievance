import React, { useState } from 'react';
import GrievanceForm from './components/GrievanceForm';
import ThankYou from './components/ThankYou';
import styles from './App.module.css';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [appState, setAppState] = useState('form');

    const correctCode = "baby";
    const yourName = "Aniket";
    const herName = "Anuhya";

    const handleVerify = (event) => {
        if (event) event.preventDefault();

        if (code === correctCode) {
            setIsAuthenticated(true);
            setAppState('form');
            setError('');
        } else {
            setIsAuthenticated(false);
            setError('Oops! That\'s not the secret code. Try again, my love! ');
        }
    };

    const handleInputChange = (event) => {
        setCode(event.target.value);
        if (error) {
            setError('');
        }
    };

    const handleGrievanceSubmitted = () => {
        setAppState('submitted');
    };

    const handleSubmitAnother = () => {
        setAppState('form');
    };

    if (!isAuthenticated) {
        return (
            <form onSubmit={handleVerify} className={styles.authContainer}>
                <h1 className={`${styles.title} font-pacifico`}>Unlock Your Portal, {herName}</h1>
                <p className={styles.subtitle}>Please enter the secret code to continue:</p>
                <input
                    type="password"
                    value={code}
                    onChange={handleInputChange}
                    placeholder="Secret code..."
                    className={styles.inputField}
                    autoFocus
                />
                <button type="submit" className={styles.verifyButton}>
                    Verify
                </button>
                {error && <p className={styles.errorMessage}>{error}</p>}
            </form>
        );
    }

    return (
        <div className={styles.mainAppContainer}>
            {appState === 'form' && (
                <GrievanceForm onFormSubmitSuccess={handleGrievanceSubmitted} />
            )}
            {appState === 'submitted' && (
                <ThankYou
                    userName={herName}
                    yourName={yourName}
                    onSubmitAnother={handleSubmitAnother}
                />
            )}
        </div>
    );
}

export default App; 