const mongoose = require('mongoose');
const Logger = require('../utilities/Logger');
const config = require('../config');

const databaseConnect = () => {
    mongoose.set("strictQuery", false);
    mongoose.connect(config.dbConnectionUrl);
    mongoose.connection.on('connected', function () {
        console.log('Database connected');
        Logger.info("Database Connected");
    });
    mongoose.connection.on('error', function (err) {
        console.log(`
            Error while connecting database
            Error reason: ${err.message}
        `);
        Logger.error(`
            Error while connecting database
            Error reason: ${err.message}
        `);
    });
    mongoose.connection.on('disconnected', function () {
        console.log("Database Disconnected");
        Logger.info("Database Disconnected");
    });
};
module.exports = databaseConnect;