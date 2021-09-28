"use strict";
/**
 * Logger module
 * The logger has two functions, info for printing normal log messages, and error for all error messages.
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.error = exports.info = void 0;
var info = function () {
    var params = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        params[_i] = arguments[_i];
    }
    if (process.env.NODE_ENV !== 'test')
        console.info.apply(console, params);
};
exports.info = info;
var error = function () {
    var params = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        params[_i] = arguments[_i];
    }
    if (process.env.NODE_ENV !== 'test')
        console.error.apply(console, params);
};
exports.error = error;
