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
    var customer = await Customers.findOne({mail: inputs.mail}).populate("cart",{ sort: 'createdAt ASC' });        
    var cart = customer.cart[0];  
    if(!cart){
      return exits.success(false);
    }
    return exits.success(cart);
  }
};