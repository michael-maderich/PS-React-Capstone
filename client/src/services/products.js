"use strict";
exports.__esModule = true;
var axios_1 = require("axios");
var BASE_URL = process.env.REACT_APP_BASE_URL || /*'http://localhost:9999*/ '/api/v1/product';
var getAll = function () {
    return axios_1["default"].get(BASE_URL);
};
var create = function (newObject) {
    return axios_1["default"].post(BASE_URL, newObject);
};
var update = function (id, newObject) {
    return axios_1["default"].put(BASE_URL + "/" + id, newObject);
};
var productsService = {
    getAll: getAll,
    create: create,
    update: update
};
exports["default"] = productsService;
