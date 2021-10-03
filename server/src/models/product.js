"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
var mongoose = require("mongoose");
/**
 * Mongoose Model for our MongoDB products Collection
 * See:
 *  https://mongoosejs.com/docs/models.html
 *  https://docs.mongodb.com/manual/core/databases-and-collections/#collections
 */
// export interface IProduct extends mongoose.Document {
// 	name: string,
// 	type: string,
// 	dateAdded: Date
// }
var productSchema = new mongoose.Schema({
    upc: {
        type: Number,
        unique: true,
        required: true
    },
    categoryMain: {
        type: String,
        required: true
    },
    categorySpecific: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    options: String,
    size: String,
    cost: Number,
    basePrice: Number,
    currentPrice: Number,
    onSale: Boolean,
    stockQty: {
        type: Number,
        required: true
    },
    description: String,
    image: String,
    isEnabled: Boolean,
    dateAdded: Date
});
productSchema.set('toJSON', {
    transform: function (document, returnedObject) {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});
exports.Product = mongoose.model /*<IProduct>*/('Product', productSchema);
/**
 * Defining Node modules differs slightly from the way of defining ES6 modules.
 * The public interface of the module is defined by setting a value to the module.exports variable.
 * We will set the value to be the Product model. The other things defined inside of the module,
 * like the variables mongoose and url will not be accessible or visible to users of the module.
 */
//module.exports = Product;
