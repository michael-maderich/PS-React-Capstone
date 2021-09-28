import mongoose = require('mongoose');

/**
 * Mongoose Model for our MongoDB groceryitems Collection
 * See:
 *  https://mongoosejs.com/docs/models.html
 *  https://docs.mongodb.com/manual/core/databases-and-collections/#collections
 */

export interface IGroceryItem extends mongoose.Document {
	name: string,
	type: string,
	dateAdded: Date
}

const groceryItemSchema = new mongoose.Schema({
	name: {
		type: String,
		unique: true,
		required: true
	},
	type: {
		type: String,
		required: true
	},
	dateAdded: Date
});

groceryItemSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	}
});


export const GroceryItem = mongoose.model<IGroceryItem>('GroceryItem', groceryItemSchema);

/**
 * Defining Node modules differs slightly from the way of defining ES6 modules.
 * The public interface of the module is defined by setting a value to the module.exports variable.
 * We will set the value to be the GroceryItem model. The other things defined inside of the module,
 * like the variables mongoose and url will not be accessible or visible to users of the module.
 */
//module.exports = GroceryItem;