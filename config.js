// Configuration file for Bet Tracker
// In production, these should be loaded from environment variables via build process

// For development, you can set these directly here (NOT recommended for production)
// In production, use a build process to inject environment variables
const CONFIG = {
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

// This file is not used anymore - credentials are in firebase-config.js

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG };
} else {
    window.CONFIG = CONFIG;
}