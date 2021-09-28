"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.unknownEndpoint = exports.requestLogger = void 0;
var logger = require("./logger");
// https://federicoferoldi.com/2017/12/28/using-the-typescript-type-system-to-validate-express-handlers.html
// Instructions are way more complicated than just this. I think I figured it out another way
// interface IResponse {
// 	readonly apply: (res: Express.Response) => void;
// }
// requestLogger - log each HTTP request to the console/log
var requestLogger = function (req, res, next) {
    logger.info('Method:', req.method);
    logger.info('Path:  ', req.path);
    logger.info('Body:  ', req.body);
    logger.info('---');
    next();
};
exports.requestLogger = requestLogger;
// unknownEndpoint - Any unknown endpoints need to return 404
var unknownEndpoint = function (req, res) {
    return res.status(404).send({ error: 'Unknown Endpoint' });
};
exports.unknownEndpoint = unknownEndpoint;
// errorHandler - Error handler middleware (MUST be loaded last)
var errorHandler = function (error, req, res, next) {
    //	logger.error(error.message);
    if (error.name === 'CastError') {
        logger.error("Error - " + error.message);
        return res.status(400).send({ error: 'Malformatted id' });
    }
    else if (error.name === 'ValidationError') {
        logger.error("ERROR: Unable to POST " + JSON.stringify(req.body) + ". Err is " + error.message);
        return res.status(400).json({ error: error.message });
    }
    next(error);
};
exports.errorHandler = errorHandler;
