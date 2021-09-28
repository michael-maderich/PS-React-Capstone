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
/**
 * A better option is to specify the tests that need to be run as parameter of the npm test command.

The following command only runs the tests found in the tests/note_api.test.js file:
npm test -- tests/note_api.test.js

The -t option can be used for running tests with a specific name:
npm test -- -t 'a specific note is within the returned notes'

The provided parameter can refer to the name of the test or the describe block. The parameter can also contain just a part of the name. The following command will run all of the tests that contain notes in their name:
npm test -- -t 'notes'
 */
var mongoose = require("mongoose");
var supertest = require("supertest");
var server_1 = require("../server");
var api = supertest(server_1.default);
var user_1 = require("../models/user");
//import bcrypt = require('bcrypt');
// const hashPassword = async (password) => {
// 	const hashedPass = await bcrypt.hash(password, 11);
// 	return hashedPass;
// };
var passwordHash = 'pass123'; //hashPassword('pass123').then( hashedPassword => hashedPassword);
var initialUsers = [
    { 'username': 'scruffmcgruff',
        'name': 'Michael Maderich',
        'passwordHash': passwordHash
    },
    {
        'username': 'CPrentzler',
        'name': 'Charisse Prentzler',
        'passwordHash': passwordHash
    },
    {
        'username': 'testytest',
        'name': 'Testy McTest',
        'passwordHash': passwordHash
    }
];
beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
    var userObjects, promiseArray;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, user_1.User.deleteMany({})];
            case 1:
                _a.sent();
                userObjects = initialUsers.map(function (user) { return new user_1.User(user); });
                promiseArray = userObjects.map(function (user) { return user.save(); });
                return [4 /*yield*/, Promise.all(promiseArray)];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
describe('When there are initially some users saved:', function () {
    test('Users are returned as JSON', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api
                        .get('/api/users')
                        .expect(200)
                        .expect('Content-Type', /application\/json/)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    test('All users are returned', function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api.get('/api/users')];
                case 1:
                    response = _a.sent();
                    // execution gets here only after the HTTP request is complete
                    expect(response.body).toHaveLength(initialUsers.length);
                    return [2 /*return*/];
            }
        });
    }); });
    test('A specific user is within the returned users', function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, usernames;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api.get('/api/users')];
                case 1:
                    response = _a.sent();
                    usernames = response.body.map(function (user) { return user.username; });
                    expect(usernames).toContain('scruffmcgruff');
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('Viewing a specific user:', function () {
    test('Succeeds with a valid id', function () { return __awaiter(void 0, void 0, void 0, function () {
        var userToView, resultNote, processedNoteToView;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userToView = initialUsers[0];
                    user_1.User.find({ username: userToView.username })
                        .then(function (foundUser) { return userToView['id'] = foundUser.id; });
                    return [4 /*yield*/, api
                            .get("/api/users/" + userToView['id'])
                            .expect(200)
                            .expect('Content-Type', /application\/json/)];
                case 1:
                    resultNote = _a.sent();
                    processedNoteToView = JSON.parse(JSON.stringify(userToView));
                    expect(resultNote.body).toEqual(processedNoteToView);
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('Addition of a new user:', function () {
    test('A valid user can be added', function () { return __awaiter(void 0, void 0, void 0, function () {
        var newUser, response, usernames;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    newUser = {
                        username: 'testUser',
                        name: 'Test User',
                        password: 'pass123'
                    };
                    return [4 /*yield*/, api.post('/api/users')
                            .send(newUser)
                            .expect(201)
                            .expect('Content-Type', /application\/json/)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, api.get('/api/users')];
                case 2:
                    response = _a.sent();
                    usernames = response.body.map(function (user) { return user.username; });
                    expect(response.body).toHaveLength(initialUsers.length + 1);
                    expect(usernames).toContain('testUser'.toLowerCase());
                    return [2 /*return*/];
            }
        });
    }); });
    test('User without username is not added', function () { return __awaiter(void 0, void 0, void 0, function () {
        var newUser;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    newUser = {
                        password: 'ABC123'
                    };
                    return [4 /*yield*/, api.post('/api/users')
                            .send(newUser)
                            .expect(400)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function () {
        mongoose.connection.close();
    });
});
