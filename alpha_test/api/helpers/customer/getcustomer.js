module.exports = {
  inputs: {
        mail: {type: 'string',required: false,},      
  },

  exits: {
    invalid: {
      responseType: 'badRequest',
      description: 'Something went wrong',
    },
  },

  fn: async function(inputs,exits){   
    var customerRegistry = await Customers.findOne({mail:inputs.mail});
    //.intercept('E_UNIQUE', 'sameItem')
    if(!customerRegistry){
      return exits.success(false);
    }

    return exits.success(customerRegistry);
  }
};