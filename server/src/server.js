"use strict";
/** Assistance for deploying to heroku found at:
 * https://www.freecodecamp.org/news/how-to-create-a-react-app-with-a-node-backend-the-complete-guide/
 */
Object.defineProperty(exports, "__esModule", { value: true });
/** Imports */
// import environment variables from utils/config
var config = require("./utils/config");
// import mongoose db module and express server module
var mongoose = require("mongoose");
var express = require("express");
var path = require("path"); // for something...
//import cors = require('cors');	// Needed for app.use(cors) but doesn't work
//const https = require('https');
var helmet = require("helmet");
// Routers
var users_1 = require("./controllers/users");
var grocery_items_1 = require("./controllers/grocery-items");
// import logger module
var logger = require("./utils/logger");
var middleware = require("./utils/middleware");
// DB config
//const MONGODB_URI = config.MONGODB_URI;	// For heroku deployment, be sure to use cli command 'heroku config:set MONGODB_URI=<full path>'
/** Connect to our MongoDB database **/
// Configure mongoose to tell us if we succeed or if we fail to connect to the DB
//mongoose.connection.on('open', () => logger.error(`MongoDB: Successfully connected to ${MONGODB_URI}`));
//mongoose.connection.on('error', (error) => logger.error(`MongoDB: Failed to connect to ${MONGODB_URI}. Error ${error.message}`));
logger.info('MongoDB: Attempting to connect ...');
var mongoOptions = { useUnifiedTopology: true, useNewUrlParser: true }; // Options object needed because some standard properties are deprecated
mongoose
    .connect(config.MONGODB_URI, mongoOptions)
    .then(function () { return logger.info('Connected to MongoDB!'); }) // should do express stuff after successful connection, no?
    .catch(function (error) { return logger.error("MongoDB Error: " + error.message); });
/**
 * Create and start our express server
 */
console.clear();
logger.info("Starting Express Server... [" + new Date().toString() + "]");
var app = express();
/**
 * Configure express server middleware
 */
//app.use(cors);		// Doesn't work this way for some reason
//enable CORS without external module
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
// Add helmet security protocols to server
app.use(helmet());
app.use(express.static('build'));
app.use(express.json()); // This allows us to parse HTTP POST request bodies
app.use(middleware.requestLogger);
// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '/client-app/build')));
/**
 * Express server routes
 */
// Send all requests to paths at '/api/v1/grocery-items'... to groceryItemsRouter
app.use('/api/v1/grocery-items/', grocery_items_1.default);
// Send all requests to paths at '/users'... to usersRouter
app.use('/api/users', users_1.default);
app.get('/', function (req, res) {
    res.json({ message: 'Hellooo World from Server!' });
});
// All other GET requests not handled here will return our React app?? from online tutorial
app.get('*', function (req, res) {
    res.sendFile(path.resolve(__dirname, '../../client-app/build', 'index.html'));
});
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler); // This must be last loaded middleware
var PORT = config.PORT || 9999; // process.env.PORT used for heroku deployment
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, function () {
        logger.info("Server listening at http://localhost:" + PORT);
    });
}
exports.default = app;
