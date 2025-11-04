// Configuration file for Bet Tracker
// In production, these should be loaded from environment variables via build process

// For development, you can set these directly here (NOT recommended for production)
// In production, use a build process to inject environment variables
// Application configuration - no sensitive data
let CONFIG;
try {
    CONFIG = {
        // Application settings
        app: {
            name: process.env.APP_NAME || "Stake Analytics",
            version: process.env.APP_VERSION || "1.0.0",
            environment: process.env.NODE_ENV || "development"
        },
        
        // Security settings
        security: {
            // Enable HTTPS in production
            requireHTTPS: process.env.NODE_ENV === "production",
            // Session timeout in minutes
            sessionTimeout: parseInt(process.env.SESSION_TIMEOUT) || 60,
            // Maximum login attempts
            maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 5
        }
    };
} catch (error) {
    console.error('Failed to initialize configuration:', error);
    throw new Error('Configuration initialization failed');
}

// Validate configuration
function validateConfig() {
    try {
        if (!CONFIG.app || !CONFIG.app.name) {
            throw new Error('Missing required app configuration');
        }
        return true;
    } catch (error) {
        console.error('Configuration validation failed:', error);
        return false;
    }
}

// Export configuration with validation
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, validateConfig };
} else {
    window.CONFIG = CONFIG;
    window.validateConfig = validateConfig;
}