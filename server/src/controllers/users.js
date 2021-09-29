"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var bcrypt = require("bcrypt");
var express = require("express");
var logger = require("../utils/logger");
var user_1 = require("../models/user");
var usersRouter = express.Router();
var SALT_ROUNDS = 11;
usersRouter.get('/', function (req, res) {
    // on react state for logic while keeping (updating) database in sync, or we can query database on every action
    user_1.User.find({}) // Finds all
        .then(function (allUsers) {
        if (allUsers.length === 0) {
            res.statusMessage = 'No Users in Database!';
            res.status(500).end();
        }
        res.status(200).json(allUsers);
    })
        .catch(function (error) { return res.status(500).send("Error on " + req.path + " - " + error); }); // change to .end()
});
usersRouter.get('/:id', function (req, res, next) {
    var id = req.params.id;
    logger.info('User ID:', id);
    user_1.User.findById(id)
        .then(function (requestedUser) {
        if (!requestedUser) {
            logger.info("Invalid endpoint - " + req.path + ".");
            res.status(404).end();
            return;
        }
        res.status(200).json(requestedUser);
    })
        .catch(function (error) {
        // logger.info(`Error - ${error.message}`);
        // res.status(400).send({error: 'Malformatted id'});
        next(error);
    }); // should technically be .end()
});
// TODO: Add apidoc documentation
/*********** NEED TO CHECK IF USER ALREADY EXISTS ***************************************************************/
usersRouter.post('/', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, name, password, isEnabled, passwordHash, newUser;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, name = _a.name, password = _a.password, isEnabled = _a.isEnabled;
                //console.log(email, name, password);
                if (!email || !name || !password) {
                    res.statusMessage = "Error - malformed POST body: " + JSON.stringify(req.body);
                    return [2 /*return*/, res.status(400).end()]; // 400: Bad Request
                }
                return [4 /*yield*/, bcrypt.hash(password, SALT_ROUNDS)];
            case 1:
                passwordHash = _b.sent();
                newUser = new user_1.User({
                    email: email.toLowerCase(),
                    name: name,
                    passwordHash: passwordHash,
                    dateAdded: new Date(),
                    isEnabled: isEnabled || true
                });
                // Save to mongoDB
                newUser.save()
                    .then(function (savedItem) { return res.status(201).json(savedItem); }) // need to send URI in Location header field? (as per official html specs)
                    .catch(function (error) { return next(error); });
                return [2 /*return*/];
        }
    });
}); });
/**
 * 201 Created
The request has been fulfilled and resulted in a new resource being created. The newly created resource can be referenced by the URI(s) returned in the entity of the response, with the most specific URI for the resource given by a Location header field. The response SHOULD include an entity containing a list of resource characteristics and location(s) from which the user or user agent can choose the one most appropriate. The entity format is specified by the media id given in the Content-id header field. The origin server MUST create the resource before returning the 201 status code. If the action cannot be carried out immediately, the server SHOULD respond with 202 (Accepted) response instead.
 */
// Need to add apidoc documentation
usersRouter.put('/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var body, id, passwordHash, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                body = req.body;
                id = req.params.id;
                if (!body) { // Don't need to check for all body object attributes because any one could be updated or added
                    res.status(400).end();
                    return [2 /*return*/];
                }
                if (!body.password) return [3 /*break*/, 2];
                return [4 /*yield*/, bcrypt.hash(body.password, SALT_ROUNDS)];
            case 1:
                _a = _b.sent();
                return [3 /*break*/, 3];
            case 2:
                _a = null;
                _b.label = 3;
            case 3:
                passwordHash = _a;
                // Get product from DB if it exists
                user_1.User.findById(id)
                    .then(function (userToUpdate) {
                    if (!userToUpdate)
                        return res.status(404).end();
                    logger.info('User before update:', JSON.stringify(userToUpdate));
                    for (var property in body) {
                        if (property !== 'id')
                            userToUpdate[property] = body[property]; // Do not allow _id to be updated
                    }
                    if (body.password)
                        userToUpdate.password = passwordHash;
                    userToUpdate.save().then(function (data) { return res.status(200).send(data); })
                        .catch(function (error) { return res.status(500).send("Error updating: " + error); });
                })
                    .catch(function (error) {
                    return res.status(500).send("Error updating: Invalid id '" + id + "'. Please check id and try again. Thank you.\n" + error.message);
                });
                return [2 /*return*/];
        }
    });
}); });
usersRouter.delete('/:id', function (req, res, next) {
    var id = req.params.id;
    user_1.User.findById(id)
        .then(function (userToDelete) {
        if (!userToDelete)
            return res.status(404).end();
        logger.info('userToDelete:', JSON.stringify(userToDelete));
        var id = userToDelete.id;
        logger.info('User id to delete:', id);
        user_1.User.findByIdAndDelete(id)
            .then(function () { return res.status(204).end(); })
            .catch(function (error) { return next(error); });
        //	// Return 404 if item not found (delete returns null)
        //	`Error on deletion: Invalid ID. Please check ID number and try again. Thank you.`
    })
        .catch(function (error) { return next(error); }); // 500 error
});
exports.default = usersRouter;
