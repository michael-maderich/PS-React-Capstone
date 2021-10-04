"use strict";
exports.__esModule = true;
var axios_1 = require("axios");
var LOGIN_URL = String(process.env.REACT_APP_API_HOST)
    //		.concat(String(process.env.REACT_APP_API_BASE))
    .concat('/api/login') ||
    'http://localhost:9999'
        //		.concat(String(process.env.REACT_APP_API_BASE))
        .concat('/api/login');
// code for these HTTP method calls is in /server/src/controllers/users.ts
var submitCredentials = function (login) {
    return axios_1["default"].post(LOGIN_URL, login);
};
var loginService = {
    submitCredentials: submitCredentials
};
exports["default"] = loginService;
