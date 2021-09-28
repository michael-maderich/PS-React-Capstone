// import logger module
import { NextFunction, Request, Response } from 'express';
import logger = require('./logger');

// https://federicoferoldi.com/2017/12/28/using-the-typescript-type-system-to-validate-express-handlers.html
// Instructions are way more complicated than just this. I think I figured it out another way
// interface IResponse {
// 	readonly apply: (res: Express.Response) => void;
// }

// requestLogger - log each HTTP request to the console/log
const requestLogger = (req:Request, res:Response, next:NextFunction):void => {
	logger.info('Method:', req.method);
	logger.info('Path:  ', req.path);
	logger.info('Body:  ', req.body);
	logger.info('---');
	next();
};

// unknownEndpoint - Any unknown endpoints need to return 404
const unknownEndpoint = (req: Request, res: Response): Response<JSON, Record<string, JSON>> =>
	res.status(404).send({ error: 'Unknown Endpoint' });

// errorHandler - Error handler middleware (MUST be loaded last)
const errorHandler = (error:Error, req:Request, res:Response, next:NextFunction): Response<JSON, Record<string, JSON>> => {
//	logger.error(error.message);
	if (error.name === 'CastError') {
		logger.error(`Error - ${error.message}`);
		return res.status(400).send({ error: 'Malformatted id' });
	} else if (error.name === 'ValidationError') {
		logger.error(`ERROR: Unable to POST ${JSON.stringify(req.body)}. Err is ${error.message}`);
		return res.status(400).json({ error: error.message });
	}
	next(error);
};

export {
	requestLogger,
	unknownEndpoint,
	errorHandler
};