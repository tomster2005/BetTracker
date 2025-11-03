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

// Load environment variables in development (for local testing only)
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    // Development override - replace with your actual values for local testing
    CONFIG.firebase = {
        apiKey: "AIzaSyAxtgFIJKNbBoXKZHWNSm5i2qwvwCwBNcA",
        authDomain: "stake-analytic.firebaseapp.com",
        projectId: "stake-analytic",
        storageBucket: "stake-analytic.firebasestorage.app",
        messagingSenderId: "939988481943",
        appId: "1:939988481943:web:b5a37162a4221fd343f6d2"
    };
}

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, validateConfig };
} else {
    window.CONFIG = CONFIG;
    window.validateConfig = validateConfig;
}