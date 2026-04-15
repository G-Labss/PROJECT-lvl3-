require("dotenv").config();

module.exports = {
    port: process.env.PORT || 3001,
    appMode: process.env.APP_MODE || "DEV", // DEV, PROD, STAGING
    mongoURI: process.env[`${process.env.APP_MODE}_MONGODB_URI`] || "mongodb://localhost:27017/tennis-coach-app",
    tokenSecret: process.env.TOKEN_SECRET || "REALLY_SECRET",
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || "REALLY_REALLY_SECRET",
    adminEmail: process.env.ADMIN_EMAIL || "daniil@tenniscoach.com",
    adminPassword: process.env.ADMIN_PASSWORD || "admin123",
}