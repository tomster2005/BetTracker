// Configuration file for Bet Tracker
// In production, these should be loaded from environment variables via build process

// For development, you can set these directly here (NOT recommended for production)
// In production, use a build process to inject environment variables
const CONFIG = {
    // Firebase configuration - DO NOT commit real credentials
    firebase: {
        apiKey: "your-api-key-here",
        authDomain: "your-project.firebaseapp.com",
        projectId: "your-project-id",
        storageBucket: "your-project.firebasestorage.app",
        messagingSenderId: "your-sender-id",
        appId: "your-app-id"
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
        if (!value || value.includes('your-') || value.includes('here')) {
            console.error(`Missing or placeholder configuration: ${key}`);
            console.error('Please set up your environment variables or update config.js with real values');
            return false;
        }
    }
    return true;
}

// This file is not used anymore - credentials are in firebase-config.js

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, validateConfig };
} else {
    window.CONFIG = CONFIG;
    window.validateConfig = validateConfig;
}