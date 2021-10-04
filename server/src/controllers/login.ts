import jwt = require('jsonwebtoken');
import bcrypt = require('bcrypt');
import express = require('express');
const loginRouter = express.Router();
import { User } from '../models/user';
// import dotenv = require('dotenv');	// Pretty sure we need this to use environment vars
// dotenv.config();

loginRouter.post('/', async (req, res) => {
	const body:{username:string, password:string} = req.body;
	// console.log('request body:',body);
	const user = await User.findOne({ email: body.username });
	const passwordCorrect:boolean = user === null? false : await bcrypt.compare(body.password, user['passwordHash']);

	if (!(user && passwordCorrect)) {
		return res.status(401).json({error:'Invalid username or password'});	// 401 Unauthorized
	}

	const userForToken = {
		username: user['email'],	// Email is unique username in db, but let's refer to it as username for auth
		id: user['_id']
	};

	const token = jwt.sign(userForToken, process.env.JWT_SECRET);

	res.status(200).send( { token, username:user['email'], firstName:user['firstName'], lastName:user['lastName'] });
});

export default loginRouter;