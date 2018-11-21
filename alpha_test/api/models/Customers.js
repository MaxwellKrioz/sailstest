/**
 * Customers.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        mail: {
            type: 'string',
            required: true,
            unique: true,
        },
        name: { 
            type:'string',
            required: true,
        },
        lastName: {type:'string', },
        password: { type:'string', required: true,},
        orders: {
            collection:'orders',
            via: 'customer'
        },
        cart: {
            collection: "cart",
            via: "customer"
        }
    },
    datastore: "mongoDB"
};

