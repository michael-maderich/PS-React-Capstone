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

The following command only runs the tests found in the tests/user_api.test.js file:
npm test -- tests/user_api.test.js

The -t option can be used for running tests with a specific name:
npm test -- -t 'a specific user is within the returned users'

The provided parameter can refer to the name of the test or the describe block. The parameter can also contain just a part of the name. The following command will run all of the tests that contain users in their name:
npm test -- -t 'users'
 */
var mongoose = require("mongoose");
var supertest = require("supertest");
var server_1 = require("../server");
var api = supertest(server_1.default);
var user_1 = require("../models/user");
var API_PATH = process.env.API_BASE + "/users";
// Helper function to retrieve all users from DB
var usersInDb = function () { return __awaiter(void 0, void 0, void 0, function () {
    var users;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, user_1.User.find({})];
            case 1:
                users = _a.sent();
                return [2 /*return*/, users.map(function (u) { return u.toJSON(); })];
        }
    });
}); };
var bcrypt = require("bcrypt");
// const hashPassword = async (password) => {
// 	const hashedPass = await bcrypt.hash(password, 11);
// 	return hashedPass;
// };
var passwordHash = 'pass123'; //hashPassword('pass123').then( hashedPassword => hashedPassword);
var initialUsers = [
    { 'email': 'scruffmcgruff@yahoo.com',
        'firstName': 'Michael',
        'lastName': 'Maderich',
        'passwordHash': passwordHash,
        'isEnabled': true
    },
    {
        'email': 'CPrentzler@aol.com',
        'firstName': 'Charisse',
        'lastName': 'Prentzler',
        'passwordHash': passwordHash,
        'isEnabled': true
    },
    {
        'email': 'testytest@hotmail.com',
        'firstName': 'Testy',
        'lastName': 'McTest',
        'passwordHash': passwordHash,
        'isEnabled': true
    }
];
beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
    var userObjects, promiseArray;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, user_1.User.deleteMany({})];
            case 1:
                _a.sent(); // Clear the test database
                userObjects = initialUsers.map(function (user) {
                    user.email = user.email.toLowerCase();
                    return new user_1.User(user);
                });
                promiseArray = userObjects.map(function (user) { return user.save(); });
                return [4 /*yield*/, Promise.all(promiseArray)];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
describe('When there is initially one user in DB:', function () {
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        var passwordHash, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, user_1.User.deleteMany({})];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, bcrypt.hash('admin', 10)];
                case 2:
                    passwordHash = _a.sent();
                    user = new user_1.User({
                        email: 'admin@admin.com',
                        passwordHash: passwordHash,
                        firstName: 'Admin',
                        lastName: 'Admin',
                        isEnabled: true
                    });
                    return [4 /*yield*/, user.save()];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    test('Creation succeeds with a fresh username', function () { return __awaiter(void 0, void 0, void 0, function () {
        var usersAtStart, newUser, usersAtEnd, usernames;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, usersInDb()];
                case 1:
                    usersAtStart = _a.sent();
                    newUser = {
                        email: 'username@random.com',
                        firstName: 'Random',
                        lastName: 'User',
                        password: 'random',
                        isEnabled: true
                    };
                    return [4 /*yield*/, api.post(API_PATH)
                            .send(newUser)
                            .expect(201)
                            .expect('Content-Type', /application\/json/)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, usersInDb()];
                case 3:
                    usersAtEnd = _a.sent();
                    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);
                    usernames = usersAtEnd.map(function (u) { return u['email']; });
                    expect(usernames).toContain(newUser.email);
                    return [2 /*return*/];
            }
        });
    }); });
    test('Creation fails with proper statuscode and message if username (email) already taken', function () { return __awaiter(void 0, void 0, void 0, function () {
        var usersAtStart, newUser, result, usersAtEnd;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, usersInDb()];
                case 1:
                    usersAtStart = _a.sent();
                    newUser = {
                        email: 'admin@admin.com',
                        firstName: 'Super',
                        lastName: 'User',
                        password: 'superuser',
                        isEnabled: true
                    };
                    return [4 /*yield*/, api.post(API_PATH)
                            .send(newUser)
                            .expect(400)
                            .expect('Content-Type', /application\/json/)];
                case 2:
                    result = _a.sent();
                    expect(result.body.error).toContain('`email` to be unique');
                    return [4 /*yield*/, usersInDb()];
                case 3:
                    usersAtEnd = _a.sent();
                    expect(usersAtEnd).toHaveLength(usersAtStart.length);
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('When there are initially some users saved:', function () {
    test('Users are returned as JSON', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api
                        .get(API_PATH)
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
                case 0: return [4 /*yield*/, api.get(API_PATH)];
                case 1:
                    response = _a.sent();
                    // execution gets here only after the HTTP request is complete
                    expect(response.body).toHaveLength(initialUsers.length);
                    return [2 /*return*/];
            }
        });
    }); });
    test('A specific user is within the returned users', function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, emails;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api.get(API_PATH)];
                case 1:
                    response = _a.sent();
                    emails = response.body.map(function (user) { return user.email; });
                    expect(emails).toContain(initialUsers[0].email);
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('Viewing a specific user:', function () {
    test('Succeeds with a valid id', function () { return __awaiter(void 0, void 0, void 0, function () {
        var userToView, id, result, resultUser, processedUserToView;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userToView = initialUsers[0];
                    id = '';
                    return [4 /*yield*/, user_1.User.find({ email: userToView.email })
                            .then(function (foundUser) {
                            id = foundUser[0].id;
                        })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, api
                            .get(API_PATH + "/" + id)
                            .expect(200)
                            .expect('Content-Type', /application\/json/)];
                case 2:
                    result = _a.sent();
                    resultUser = result.body;
                    resultUser.id = id;
                    delete resultUser.passwordHash;
                    processedUserToView = JSON.parse(JSON.stringify(userToView));
                    expect(resultUser.email).toEqual(processedUserToView.email);
                    expect(resultUser.firstName).toEqual(processedUserToView.firstName);
                    expect(resultUser.lastName).toEqual(processedUserToView.lastName);
                    return [2 /*return*/];
            }
        });
    }); });
    test('Fails with statuscode 404 if user does not exist', function () { return __awaiter(void 0, void 0, void 0, function () {
        var nonExistingId, validNonexistingId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nonExistingId = function () { return __awaiter(void 0, void 0, void 0, function () {
                        var user;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    user = new user_1.User({ email: 'willremovethissoon', firstName: 'Delete', lastName: 'This', password: 'blah', isEnabled: true });
                                    return [4 /*yield*/, user.save()];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, user.remove()];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/, user._id.toString()];
                            }
                        });
                    }); };
                    validNonexistingId = nonExistingId;
                    return [4 /*yield*/, api
                            .get(API_PATH + "/" + validNonexistingId)
                            .expect(404)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    test('Fails with statuscode 400 if id is invalid', function () { return __awaiter(void 0, void 0, void 0, function () {
        var invalidId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    invalidId = '5a3d5da59070081a82a3445';
                    return [4 /*yield*/, api
                            .get(API_PATH + "/" + invalidId)
                            .expect(400)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('Addition of a new user:', function () {
    test('A valid user can be added', function () { return __awaiter(void 0, void 0, void 0, function () {
        var newUser, response, emails;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    newUser = {
                        email: 'testUser@email.com',
                        firstName: 'Test',
                        lastName: 'User',
                        password: 'pass123',
                        isEnabled: true
                    };
                    return [4 /*yield*/, api.post(API_PATH)
                            .send(newUser)
                            .expect(201)
                            .expect('Content-Type', /application\/json/)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, api.get(API_PATH)];
                case 2:
                    response = _a.sent();
                    emails = response.body.map(function (user) { return user.email; });
                    expect(response.body).toHaveLength(initialUsers.length + 1);
                    expect(emails).toContain(newUser.email.toLowerCase());
                    return [2 /*return*/];
            }
        });
    }); });
    test('User without email is not added', function () { return __awaiter(void 0, void 0, void 0, function () {
        var newUser;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    newUser = {
                        password: 'ABC123'
                    };
                    return [4 /*yield*/, api.post(API_PATH)
                            .send(newUser)
                            .expect(400)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('Deletion of a user:', function () {
    test('Succeeds with status code 204 if id is valid', function () { return __awaiter(void 0, void 0, void 0, function () {
        var userToDelete, id, usersAtEnd, emails;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userToDelete = initialUsers[0];
                    id = '';
                    return [4 /*yield*/, user_1.User.find({ email: userToDelete.email })
                            .then(function (foundUser) {
                            id = foundUser[0].id;
                        })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, api.delete(API_PATH + "/" + id).expect(204)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, user_1.User.find({})];
                case 3:
                    usersAtEnd = _a.sent();
                    expect(usersAtEnd).toHaveLength(initialUsers.length - 1);
                    emails = usersAtEnd.map(function (r) { return r['email']; });
                    expect(emails).not.toContain(userToDelete.email);
                    return [2 /*return*/];
            }
        });
    }); });
});
afterAll(function () {
    mongoose.connection.close();
});
