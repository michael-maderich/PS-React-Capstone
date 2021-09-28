/**
 * A better option is to specify the tests that need to be run as parameter of the npm test command.

The following command only runs the tests found in the tests/note_api.test.js file:
npm test -- tests/note_api.test.js

The -t option can be used for running tests with a specific name:
npm test -- -t 'a specific note is within the returned notes'

The provided parameter can refer to the name of the test or the describe block. The parameter can also contain just a part of the name. The following command will run all of the tests that contain notes in their name:
npm test -- -t 'notes'
 */
import mongoose = require('mongoose');
import supertest = require('supertest');
import app from '../server';
const api = supertest(app);
import {User} from '../models/user';
//import bcrypt = require('bcrypt');
// const hashPassword = async (password) => {
// 	const hashedPass = await bcrypt.hash(password, 11);
// 	return hashedPass;
// };
const passwordHash = 'pass123';//hashPassword('pass123').then( hashedPassword => hashedPassword);
const initialUsers = [
	{	'username':'scruffmcgruff',
		'name':'Michael Maderich',
		'passwordHash':passwordHash
	},
	{
		'username':'CPrentzler',
		'name':'Charisse Prentzler',
		'passwordHash':passwordHash
	},
	{
		'username':'testytest',
		'name':'Testy McTest',
		'passwordHash':passwordHash
	}
];

beforeEach(async () => {
	await User.deleteMany({});
	const userObjects = initialUsers.map(user => new User(user));
	const promiseArray = userObjects.map(user => user.save());
	await Promise.all(promiseArray);
	// initialUsers.forEach(async user => {
	// 	const userObject = new User(user);
	// 	await userObject.save();
	// });
});

describe('When there are initially some users saved:', () => {

	test('Users are returned as JSON', async () => {
		await api
			.get('/api/users')
			.expect(200)
			.expect('Content-Type', /application\/json/);
	});

	test('All users are returned', async () => {
		const response = await api.get('/api/users');
		// execution gets here only after the HTTP request is complete
		expect(response.body).toHaveLength(initialUsers.length);
	});

	test('A specific user is within the returned users', async () => {
		const response = await api.get('/api/users');
		const usernames = response.body.map(user => user.username);
		expect(usernames).toContain('scruffmcgruff');
	});
});

describe('Viewing a specific user:', () => {
	test('Succeeds with a valid id', async() => {
		const userToView = initialUsers[0];
		User.find({username:userToView.username})
			.then(foundUser => userToView['id'] = foundUser.id);
		const resultNote = await api
			.get(`/api/users/${userToView['id']}`)
			.expect(200)
			.expect('Content-Type', /application\/json/);

		const processedNoteToView = JSON.parse(JSON.stringify(userToView));

		expect(resultNote.body).toEqual(processedNoteToView);
	});
});

describe('Addition of a new user:', () => {
	test('A valid user can be added', async () => {
		const newUser = {
			username: 'testUser',
			name: 'Test User',
			password: 'pass123'
		};

		await api.post('/api/users')
			.send(newUser)
			.expect(201)
			.expect('Content-Type', /application\/json/);
		const response = await api.get('/api/users');
		const usernames = response.body.map(user => user.username);
		expect(response.body).toHaveLength(initialUsers.length + 1);
		expect(usernames).toContain('testUser'.toLowerCase());
	});

	test('User without username is not added', async () => {
		const newUser = {
			password: 'ABC123'
		};
		await api.post('/api/users')
			.send(newUser)
			.expect(400);
	});
	afterAll(() => {
		mongoose.connection.close();
	});
});
