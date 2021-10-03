/**
 * A better option is to specify the tests that need to be run as parameter of the npm test command.

The following command only runs the tests found in the tests/user_api.test.js file:
npm test -- tests/user_api.test.js

The -t option can be used for running tests with a specific name:
npm test -- -t 'a specific user is within the returned users'

The provided parameter can refer to the name of the test or the describe block. The parameter can also contain just a part of the name. The following command will run all of the tests that contain users in their name:
npm test -- -t 'users'
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
	{	'email':'scruffmcgruff@yahoo.com',
		'firstName':'Michael',
		'lastName':'Maderich',
		'passwordHash':passwordHash,
		'isEnabled':true
	},
	{
		'email':'CPrentzler@aol.com',
		'firstName':'Charisse',
		'lastName': 'Prentzler',
		'passwordHash':passwordHash,
		'isEnabled':true
	},
	{
		'email':'testytest@hotmail.com',
		'firstName':'Testy',
		'lastName':'McTest',
		'passwordHash':passwordHash,
		'isEnabled':true
	}
];

beforeEach(async () => {
	await User.deleteMany({});		// Clear the test database
	const userObjects = initialUsers.map(user => {
		user.email = user.email.toLowerCase();
		return new User(user);
	});
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
			.get('/api/v1/users')
			.expect(200)
			.expect('Content-Type', /application\/json/);
	});

	test('All users are returned', async () => {
		const response = await api.get('/api/v1/users');
		// execution gets here only after the HTTP request is complete
		expect(response.body).toHaveLength(initialUsers.length);
	});

	test('A specific user is within the returned users', async () => {
		const response = await api.get('/api/v1/users');
		const emails = response.body.map(user => user.email);
		expect(emails).toContain(initialUsers[0].email);
	});
});

describe('Viewing a specific user:', () => {
	test('Succeeds with a valid id', async() => {
		const userToView = initialUsers[0];
		let id = '';
		await User.find({email:userToView.email})
			.then(foundUser => {
				id = foundUser[0].id;
			});
		const result = await api
			.get(`/api/v1/users/${id}`)
			.expect(200)
			.expect('Content-Type', /application\/json/);
		const resultUser = result.body;
		resultUser.id = id;
		delete resultUser.passwordHash;
		const processedUserToView = JSON.parse(JSON.stringify(userToView));

		expect(resultUser.email).toEqual(processedUserToView.email);
		expect(resultUser.firstName).toEqual(processedUserToView.firstName);
		expect(resultUser.lastName).toEqual(processedUserToView.lastName);
	});

	test('Fails with statuscode 404 if user does not exist', async () => {
		const nonExistingId = async () => {
			const user = new User(
				{ email: 'willremovethissoon', firstName: 'Delete', lastName: 'This', password:'blah' , isEnabled:true});
			await user.save();
			await user.remove();

			return user._id.toString();
		};
		const validNonexistingId = nonExistingId;
		await api
			.get(`/api/v1/users/${validNonexistingId}`)
			.expect(404);
	});

	test('Fails with statuscode 400 if id is invalid', async () => {
		const invalidId = '5a3d5da59070081a82a3445';

		await api
			.get(`/api/v1/users/${invalidId}`)
			.expect(400);
	});
});

describe('Addition of a new user:', () => {
	
	test('A valid user can be added', async () => {
		const newUser = {
			email: 'testUser@email.com',
			firstName: 'Test',
			lastName: 'User',
			password: 'pass123',
			isEnabled: true
		};

		await api.post('/api/v1/users')
			.send(newUser)
			.expect(201)
			.expect('Content-Type', /application\/json/);
		const response = await api.get('/api/v1/users');
		const emails = response.body.map(user => user.email);
		expect(response.body).toHaveLength(initialUsers.length + 1);
		expect(emails).toContain(newUser.email.toLowerCase());
	});

	test('User without email is not added', async () => {
		const newUser = {
			password: 'ABC123'
		};
		await api.post('/api/v1/users')
			.send(newUser)
			.expect(400);
	});
});

describe('Deletion of a user:', () => {
	test('Succeeds with status code 204 if id is valid', async () => {
		const userToDelete = initialUsers[0];
		let id = '';
		await User.find({ email: userToDelete.email })
			.then(foundUser => {
				id = foundUser[0].id;
			});

		await api.delete(`/api/v1/users/${id}`).expect(204);

		const usersAtEnd = await User.find({});
		expect(usersAtEnd).toHaveLength(initialUsers.length - 1);

		const emails = usersAtEnd.map(r => r.email);
		expect(emails).not.toContain(userToDelete.email);
	});
});

afterAll(() => {
	mongoose.connection.close();
});