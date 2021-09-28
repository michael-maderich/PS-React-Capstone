"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
// import logger module
var logger = require("../utils/logger");
var grocery_item_1 = require("../models/grocery-item");
var groceryItemsRouter = express.Router();
/**
   * @api {get} /api/v1/grocery-items List all grocery items
   * @apiDescription Returns an array of all grocery items
   * @apiVersion 1.0.0
   * @apiName GetGroceryItems
   * @apiGroup GroceryItem
   * @apiPermission none
   *
   * @apiSuccess (200) {Object[]} groceryItems List of grocery items
   * @apiSuccess (200) {String}		name		Name of grocery item
   * @apiSuccess (200) {String}		type		Type of grocery item
   *
   * @apiError (Bad Request 400)
 */
groceryItemsRouter.get('/', function (req, res) {
    // on react state for logic while keeping (updating) database in sync, or we can query database on every action
    grocery_item_1.GroceryItem // mongoose model item based on declared schema
        .find({}) // Finds all
        .then(function (allGroceryItems) {
        if (allGroceryItems.length === 0) {
            res.statusMessage = 'Empty Database!';
            res.status(500).end();
        }
        res.status(200).json(allGroceryItems);
    })
        .catch(function (error) { return res.status(500).send("Error on " + req.path + " - " + error); }); // change to .end()
});
/**
   * @api {get} grocery-items/:type List all grocery items of type
   * @apiDescription Returns an array of all grocery items of a certain type
   * @apiVersion 1.0.0
   * @apiName GetGroceryItemsOfType
   * @apiGroup GroceryItem
   * @apiPermission none
   *
   * @apiSuccess (200) {Object[]} groceryItems List of grocery items of requested type
   * @apiSuccess (200) {String}   name       Name of grocery item
   * @apiSuccess (200) {String}   type      Type of grocery item
   *
   * @apiError (Bad Request 400)
 */
groceryItemsRouter.get('/:type', function (req, res, next) {
    var type = req.params.type;
    logger.info(type);
    grocery_item_1.GroceryItem
        .find({ type: type })
        .then(function (desiredItems) {
        if (desiredItems)
            res.status(200).json(desiredItems);
        else {
            logger.info("Invalid route - " + req.path + ". Valid routes are 'fruit', 'vegetable'");
            res.status(404).end();
        }
    })
        .catch(function (error) {
        // logger.info(`Error - ${error.message}`);
        // res.status(400).send({error: 'Malformatted id'});
        next(error);
    }); // should technically be .end()
});
// TODO: Add apidoc documentation
groceryItemsRouter.post('/', function (req, res, next) {
    //json object to add sent in request. send results in response?
    var _a = req.body, name = _a.name, type = _a.type;
    if (!name || !type) {
        res.statusMessage = "Error - malformed POST body: " + JSON.stringify(req.body);
        return res.status(400).end(); // 400: Bad Request
    }
    // Create mongoose GroceryItem model instance. We can then save this to mongoDB as a document
    var newItem = new grocery_item_1.GroceryItem({
        name: name,
        type: type,
        dateAdded: new Date()
    }); // mongoose model item based on declared schema
    // Save to mongoDB
    newItem // so save command is performed on (newItem) GroceryItem =
        // mongoose.model('GroceryItem', groceryItemSchema) (declared in models/grocery-item.ts)
        .save() // it's a promise so then/catch. Then is akin to an event handler for wtf successful outcome
        .then(function (savedItem) { return res.status(201).json(savedItem); }) // need to send URI in Location header field? (as per official html specs)
        .catch(function (error) { return next(error); });
});
/**
 * 201 Created
The request has been fulfilled and resulted in a new resource being created. The newly created resource can be referenced by the URI(s) returned in the entity of the response, with the most specific URI for the resource given by a Location header field. The response SHOULD include an entity containing a list of resource characteristics and location(s) from which the user or user agent can choose the one most appropriate. The entity format is specified by the media type given in the Content-Type header field. The origin server MUST create the resource before returning the 201 status code. If the action cannot be carried out immediately, the server SHOULD respond with 202 (Accepted) response instead.
 */
// Need to add apidoc documentation
groceryItemsRouter.put('/:name', function (req, res) {
    var body = req.body;
    var name = req.params.name.toString().trim();
    if (!body || !(body.name && body.type)) {
        res.status(400).end();
        return;
    }
    // Get product from DB if it exists
    grocery_item_1.GroceryItem.find({ name: name })
        .then(function (foundItem) {
        var itemToUpdate = foundItem[0];
        logger.info('item before update:', JSON.stringify(itemToUpdate));
        itemToUpdate.name = body.name;
        itemToUpdate.type = body.type;
        itemToUpdate.save().then(function (data) { return res.status(200).send(data); })
            .catch(function (error) { return res.status(500).send("Error updating: " + error); });
    })
        .catch(function (error) {
        return res.status(500).send("Error updating: Invalid product '" + name + "'. Please check product name and try again. Thank you.\n" + error.message);
    });
});
groceryItemsRouter.delete('/:name', function (req, res, next) {
    var name = req.params.name;
    grocery_item_1.GroceryItem.find({ name: name })
        .then(function (foundItem) {
        var itemToDelete = foundItem[0];
        logger.info('itemToDelete:', JSON.stringify(itemToDelete));
        var id = itemToDelete.id;
        logger.info('id', id);
        grocery_item_1.GroceryItem.findByIdAndDelete(id)
            .then(function () { return res.status(204).end(); })
            .catch(function (error) { return next(error); });
        //	// Return 404 if item not found (delete returns null)
        //	`Error on deletion: Invalid ID. Please check ID number and try again. Thank you.`
    })
        .catch(function (error) { return next(error); }); // 500 error
});
exports.default = groceryItemsRouter;
