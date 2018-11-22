module.exports = {
  inputs: {
      mail: {type: 'string',required: false,},
      id: {type: 'string',required: false,},      
  },

  exits: {
    invalid: {
      responseType: 'badRequest',
      description: 'Something went wrong',
    },
  },

  fn: async function(inputs,exits){   
    if(!inputs.mail && !inputs.id){
      return  exits.invalid();
    }
    if(inputs.id){
      var cart = await Cart.findOne({id: inputs.id});
      return exits.success(cart);
    }else{
      var customer = await Customers.findOne({mail: inputs.mail}).populate("cart",{ sort: 'createdAt ASC',where: {active: true}});         
    }
    if(!customer.cart[0]){
      return exits.success(false);
    }else{
      return exits.success(customer.cart[0]);
    }
  }
};