/**
 * Orders.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        totalCost: {
            type: "number",
            columnType: 'float'
        },
        discount: {
            columnType: 'float',
            type: 'float'
        },
        products:{
           type: 'json'
        },
        active:{
            type:"boolean"
        },
        customer:{
            model: "customers",
            unique: true
        }
    },
    datastore: "mongoDB"
};

