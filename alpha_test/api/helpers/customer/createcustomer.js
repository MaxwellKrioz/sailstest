module.exports = {
  friendlyName: 'Createcustomer',
  inputs: {
        mail: {
          type: 'string',
          required: true,
        },
        name: { 
          type:'string',required: true,
        },
        lastName: {
          type:'string', required: true,
        },
        password: { 
          type:'string', required: true,
        },
  },

  exits: {
    invalid: {
      responseType: 'badRequest',
      description: 'Something went wrong',
    },
  },

  fn: async function(inputs,exits){
    var productObj = {
      mail: inputs.mail,
      name: inputs.name,
      lastName: inputs.lastName,
      password: inputs.password,
    };    
    var customerRegistry = await Customers.create(productObj)
    //.intercept('E_UNIQUE', 'sameItem')
    .intercept({name: 'UsageError'}, 'invalid')
    .fetch();   
    return exits.success(customerRegistry);
  }
};