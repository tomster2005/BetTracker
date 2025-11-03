// Configuration file for Bet Tracker
// In production, these should be loaded from environment variables

const CONFIG = {
    // Firebase configuration
    firebase: {
        apiKey: process.env.FIREBASE_API_KEY || "AIzaSyAxtgFIJKNbBoXKZHWNSm5i2qwvwCwBNcA",
        authDomain: process.env.FIREBASE_AUTH_DOMAIN || "stake-analytic.firebaseapp.com",
        projectId: process.env.FIREBASE_PROJECT_ID || "stake-analytic",
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "stake-analytic.firebasestorage.app",
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "939988481943",
        appId: process.env.FIREBASE_APP_ID || "1:939988481943:web:b5a37162a4221fd343f6d2"
    },
    
    // Application settings
    app: {
        name: "Stake Analytics",
        version: "1.0.0",
        environment: process.env.NODE_ENV || "development"
    },
    
    // Security settings
    security: {
        // Enable HTTPS in production
        requireHTTPS: process.env.NODE_ENV === "production",
        // Session timeout in minutes
        sessionTimeout: 60,
        // Maximum login attempts
        maxLoginAttempts: 5
    }
};

// Validate required configuration
function validateConfig() {
    const required = [
        'firebase.apiKey',
        'firebase.authDomain',
        'firebase.projectId'
    ];
    
    for (const key of required) {
        const value = key.split('.').reduce((obj, k) => obj?.[k], CONFIG);
        if (!value) {
            console.error(`Missing required configuration: ${key}`);
            return false;
        }
    }
    return true;
}

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, validateConfig };
} else {
    window.CONFIG = CONFIG;
    window.validateConfig = validateConfig;
}