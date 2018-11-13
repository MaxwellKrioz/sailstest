/**
 * Product.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
    attributes: {
        name:{
            type: "string",
            unique: true
        },
        description:{
            type: "string"
        },
        price: {
            type: "float"
        },
        image: {
            type: "string"
        },
        active:{
            type: "boolean",
            defaultsTo: true,
        },
        sizes: {
            collection:'sizes',
            via:'product',
        }
      },
      datastore: "mongoDB"
};

