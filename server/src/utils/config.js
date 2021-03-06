"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PORT = exports.MONGO_URI = void 0;
var dotenv = require("dotenv");
dotenv.config();
var PORT = process.env.PORT;
exports.PORT = PORT;
var MONGO_URI = process.env.NODE_ENV === 'test' ?
    process.env.TEST_MONGO_URI :
    process.env.MONGO_URI;
exports.MONGO_URI = MONGO_URI;
