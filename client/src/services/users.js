"use strict";
exports.__esModule = true;
var axios_1 = require("axios");
// const URL = String(process.env.REACT_APP_BASE_URL);
// const API_PATH = String(process.env.REACT_APP_API_BASE);
var BASE_URL = String(process.env.REACT_APP_API_HOST).concat(String(process.env.REACT_APP_API_BASE)).concat('/users')
    || 'http://localhost:9999'.concat(String(process.env.REACT_APP_API_BASE)).concat('/users');
// code for these HTTP method calls is in /server/src/controllers/users.ts
var getAll = function () {
    return axios_1["default"].get(BASE_URL);
};
var create = function (newObject) {
    return axios_1["default"].post(BASE_URL, newObject);
};
var update = function (id, newObject) {
    return axios_1["default"].put(BASE_URL + "/" + id, newObject);
};
var del = function (id) {
    return axios_1["default"]["delete"](BASE_URL + "/" + id);
};
var usersService = {
    getAll: getAll,
    create: create,
    update: update,
    del: del
};
exports["default"] = usersService;
