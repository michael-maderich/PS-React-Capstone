/** Assistance for deploying to heroku found at:
 * https://www.freecodecamp.org/news/how-to-create-a-react-app-with-a-node-backend-the-complete-guide/
 */

/** Imports */
// import environment variables from utils/config
import config = require('./utils/config');
// import mongoose db module and express server module
import mongoose = require('mongoose');
import {ConnectOptions} from 'mongoose';
import express = require('express');
import path = require('path');		// For correct path to serve React client from backend
//import cors = require('cors');	// Needed for app.use(cors) but doesn't work
//const https = require('https');
import helmet = require('helmet');

// Routers
import loginRouter from './controllers/login';
import usersRouter from './controllers/users';
import productsRouter from './controllers/products';

// import logger module
import logger = require('./utils/logger');
import middleware = require('./utils/middleware');


// DB config
//const MONGO_URI = config.MONGO_URI;	// For heroku deployment, be sure to use cli command 'heroku config:set MONGO_URI=<full path>'

/** Connect to our MongoDB database **/
// Configure mongoose to tell us if we succeed or if we fail to connect to the DB
//mongoose.connection.on('open', () => logger.error(`MongoDB: Successfully connected to ${MONGO_URI}`));
//mongoose.connection.on('error', (error) => logger.error(`MongoDB: Failed to connect to ${MONGO_URI}. Error ${error.message}`));

logger.info('MongoDB: Attempting to connect ...');
const mongoOptions = {useUnifiedTopology:true, useNewUrlParser:true}; // Options object needed because some standard properties are deprecated
mongoose
	.connect(config.MONGO_URI, mongoOptions as ConnectOptions)
	.then(() => logger.info('Connected to MongoDB!')) // should do express stuff after successful connection, no?
	.catch(error => logger.error(`MongoDB Error: ${error.message}`));



/**
 * Create and start our express server
 */
console.clear();
logger.info(`Starting Express Server... [${new Date().toString()}]`);

const app = express();

/**
 * Configure express server middleware
 */

//app.use(cors);		// Doesn't work this way for some reason
//enable CORS without external module
app.use( (req, res, next) => {	// I feel like this should be req.header not res and it seems to work either way?
	res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});
// Add helmet security protocols to server
app.use(helmet());
app.use(express.static('build'));
app.use(express.json());		// This allows us to parse HTTP POST request bodies
app.use(middleware.requestLogger);
// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '/client-app/build')));


/**
 * Express server routes
 */
// Send all requests to paths at '`${API_BASE'}/product'... to productsRouter
app.use(`${process.env.API_BASE}/product/`, productsRouter);
// Send all requests to paths at '/users'... to usersRouter
app.use(`${process.env.API_BASE}/users`, usersRouter);
app.use('/api/login', loginRouter);

app.get('/', (req, res) => {
	res.json({message:'Hellooo World from Server!'});
});

// All other GET requests not handled here will return our React app?? from online tutorial
app.get('*', (req, res) => {
	res.sendFile(path.resolve(__dirname, '../../client-app/build', 'index.html'));
});

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);	// This must be last loaded middleware


const PORT = config.PORT || 9999;	// process.env.PORT used for heroku deployment
if (process.env.NODE_ENV !== 'test') {
	app.listen(PORT, () => {
		logger.info(`Server listening at http://localhost:${PORT}`);
	});
}

export default app;