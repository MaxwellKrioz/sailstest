/**
 * Orders.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        number: { type: 'number', autoIncrement: true },    
        cart:{
            model: 'cart',
        },
        status:{
            type:"string"
        },
        customer:{
            model: "customers"
        },
        payment:{
            type: "json"
        }
    },
    datastore: "mongoDB"
};

