"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PORT = exports.MONGODB_URI = void 0;
var dotenv = require("dotenv");
dotenv.config();
var PORT = process.env.PORT;
exports.PORT = PORT;
var MONGODB_URI = process.env.NODE_ENV === 'test' ?
    process.env.TEST_MONGODB_URI :
    process.env.MONGODB_URI;
exports.MONGODB_URI = MONGODB_URI;
