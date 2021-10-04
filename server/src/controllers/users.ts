import bcrypt = require('bcrypt');
import express = require('express');
import logger = require('../utils/logger');
import {User} from '../models/user';
const usersRouter = express.Router();

const SALT_ROUNDS = 11;

usersRouter.get('/', async (req, res) => { // so we can either get data from db in the beginning and rely
	// on react state for logic while keeping (updating) database in sync, or we can query database on every action
	await User.find({})//.populate('orders', {fieldtoinclude: 1, anotherfield: 1, exlude:0???})		// Finds all
		.then( allUsers => {
			if (allUsers.length === 0) {
				res.statusMessage = 'No Users in Database!';
				res.status(500).end();
			}
			res.status(200).json(allUsers);
		})
		.catch( error => res.status(500).send(`Error on ${req.path} - ${error}`)); // change to .end()
});

usersRouter.get('/:id', async (req, res, next) => {
	const {id} = req.params;
	logger.info('User ID:', id);
	await User.findById(id)
		.then(requestedUser => {
			if (!requestedUser) {
				logger.info(`Invalid endpoint - ${req.path}.`);
				res.status(404).end();
				return;
			}
			res.status(200).json(requestedUser);
		})
		.catch( error => {
			// logger.info(`Error - ${error.message}`);
			// res.status(400).send({error: 'Malformatted id'});
			next(error);
		}); // should technically be .end()
});

// TODO: Add apidoc documentation
// Username (email) uniqueness checked by mongoose validtor in schema
usersRouter.post('/', async (req, res, next) => {
	const userData = req.body;
	const { email, firstName, lastName, password, isEnabled } = userData;
	//console.log(email, name, password);
	if (!email || !firstName || !lastName || !password) {
		res.statusMessage = `Error - malformed POST body: ${JSON.stringify(req.body)}`;
		return res.status(400).end(); // 400: Bad Request
	}

	const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
	delete userData.password;

	// Format user data to fit DB schema and for capitalization, etc
	const formattedUserData = {
		...userData,
		email: email.toLowerCase(),
		firstName: firstName.charAt(0).concat(firstName.slice(1)),
		lastName: lastName.charAt(0).concat(lastName.slice(1)),
		passwordHash: passwordHash,
		dateAdded: new Date(Date.now()),
		isEnabled: isEnabled || true
	};
	// Create mongoose User model instance. We can then save this to mongoDB as a document
	const newUser = new User(formattedUserData);
	// Save to mongoDB
	await newUser.save()
		.then((savedItem) => res.status(201).json(savedItem)) // need to send URI in Location header field? (as per official html specs)
		.catch(error => next(error));
});

/**
 * 201 Created
The request has been fulfilled and resulted in a new resource being created. The newly created resource can be referenced by the URI(s) returned in the entity of the response, with the most specific URI for the resource given by a Location header field. The response SHOULD include an entity containing a list of resource characteristics and location(s) from which the user or user agent can choose the one most appropriate. The entity format is specified by the media id given in the Content-id header field. The origin server MUST create the resource before returning the 201 status code. If the action cannot be carried out immediately, the server SHOULD respond with 202 (Accepted) response instead.
 */
// Need to add apidoc documentation
usersRouter.put('/:id', async (req, res) => {
	const {body} = req;
	const {id} = req.params;

	if (!body) {		// Don't need to check for all body object attributes because any one could be updated or added
		res.status(400).end();
		return;
	}
	const passwordHash = body.password ? await bcrypt.hash(body.password, SALT_ROUNDS) : null;

	// Get user from DB if it exists
	await User.findById(id)
		.then(async userToUpdate => {
			if (!userToUpdate) return res.status(404).end();
			logger.info('User before update:',JSON.stringify(userToUpdate));
			for (const property in body) {
				if (property!=='id') userToUpdate[property] = body[property];	// Do not allow _id to be updated
			}
			if (body.password) userToUpdate['passwordHash'] = passwordHash;

			await userToUpdate.save().then(data => res.status(200).send(data))
				.catch( (error:Error) => res.status(500).send(`Error updating: ${error}`));
		})
		.catch(error =>
			res.status(500).send(`Error updating: Invalid id '${id}'. Please check id and try again. Thank you.\n${error.message}`)
		);
});

usersRouter.delete('/:id', async (req, res, next) => {
	const {id} = req.params;
	await User.findById(id)
		.then( async userToDelete => {
			if (!userToDelete) return res.status(404).end();
			logger.info('userToDelete:', JSON.stringify(userToDelete));
			const {id} = userToDelete;
			logger.info('User id to delete:', id);
			await User.findByIdAndDelete(id)
				.then( () => res.status(204).end() )
				.catch(error => next(error));
			//	// Return 404 if item not found (delete returns null)
			//	`Error on deletion: Invalid ID. Please check ID number and try again. Thank you.`
		})
		.catch( (error) => next(error));	// 500 error
});

export default usersRouter;