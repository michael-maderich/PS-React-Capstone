import mongoose = require('mongoose');
import uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
	email: {		// Email will be unique username
		type: String,
		unique: true,
		required: true
	},
	passwordHash: {
		type: String,
		required: true
	},
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	phone: String,
	address: String,
	city: String,
	state: String,
	preferredPayment: String,
	paymentHandle: String,
	dateAdded: Date,
	dateUpdated: Date,
	role: String, // enum?
	isEnabled: {		// To have users deletable but retain info and order history, etc
		type: Boolean,
		required: true
	},
	orders: [
		{
			type:mongoose.Schema.Types.ObjectId,
			ref: 'Order'
		}
	]
	// externalFieldRef: {
	// 	type: mongoose.Schema.Types.ObjectId,
	// 	ref: 'OtherDocument'
	// }
});

userSchema.plugin(uniqueValidator);		// Attach uniqueness validator to schema

// Make some adjustments to the returned data
// set id as string version of ObjectId _id and remove _id and __v
userSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
		delete returnedObject.passwordHash; // PasswordHash should not be revealed
	}
});

export const User = mongoose.model('User', userSchema);