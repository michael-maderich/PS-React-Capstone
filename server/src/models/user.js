"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var mongoose = require("mongoose");
var userSchema = new mongoose.Schema({
    email: {
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
    role: String,
    isEnabled: {
        type: Boolean,
        required: true
    }
    // externalFieldRef: {
    // 	type: mongoose.Schema.Types.ObjectId,
    // 	ref: 'OtherDocument'
    // }
});
// Make some adjustments to the returned data
// set id as string version of ObjectId _id and remove _id and __v
userSchema.set('toJSON', {
    transform: function (document, returnedObject) {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.passwordHash; // Password should not be revealed
    }
});
exports.User = mongoose.model('User', userSchema);
