import mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		unique: true,
		required: true
	},
	name: String,
	passwordHash: {
		type: String,
		required: true
	},
	dateAdded: {
		type: Date,
	},
	dateUpdated: {
		type: Date
	}
	// externalFieldRef: {
	// 	type: mongoose.Schema.Types.ObjectId,
	// 	ref: 'OtherDocument'
	// }
});

// Make some adjustments to the returned data
// set id as string version of ObjectId _id and remove _id and __v
userSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
		returnedObject.username = returnedObject.username.toLowerCase();
		delete returnedObject.passwordHash; // Password should not be revealed
	}
});

export const User = mongoose.model('User', userSchema);