module.exports = {
  inputs: {
  			cart:{
  				type:"string",
  				required: true,
  			},
        customer:{
          type: "string",
          required: true,
        },
        payment: {
          type: "json",
          required: true,
        },
  },

  exits: {
    success: {
      outputFriendlyName: 'yuBOUGHT?'
    },

    invalidCard: {
      description: 'The payment methot is not valid'
    }
  },

  fn: async function(inputs,exits){
    var orderObj = {
      cart: inputs.cart,
      customer: inputs.customer,
      payment: inputs.payment,
    };    
    var orderRegistry = await Orders.create(orderObj)
    .tolerate(function(err,sft){
      console.log("Error-",err);
      return exits.invalidCard();
    })    
    //.intercept({name: 'UsageError'}, 'invalid')
    .fetch();   

    await Cart.drop({id:inputs.cart});
    //var tetra = await ProductSizes.create(sizesObj).fetch();    
    return exits.success(orderRegistry);
  }
}
