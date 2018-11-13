module.exports = {
  inputs: {
  			mail:{
  				type:"string",
  				required: true,
  			},
        product:{
          type: "string",
          required: true,
        },      
        quantity: {
          type: "number",
          required: true,
        },
        size: {
          type: "string",
          required: true
        }
  },

  exits: {
    invalid: {
      responseType: 'badRequest',
      description: 'Something went wrong',
    },
    sizeWrong: {
      responseType: 'badRequest',
      description: 'Something went wrong with sizes',
    },
  },

  fn: async function(inputs,exits){//It should use customer ID
    var cart = await Cart.findOne({mail:inputs.mail});
    if (!cart){
      var newProd = {
        product:inputs.product,
        sizes:[{size:inputs.size,quantity:inputs.quantity}]
      };

      var cost = await Products.findOne({
        where:{id:inputs.product},
        select:['price']
      });

      var totalCost = cost;

      //var finalCost = 0; //TODO with discount
      var newCart = await Cart.create({
        totalCost: totalCost,
        discount: 0,
        customer: inputs.customer,
        products:newProd
      }).fetch();

      return exits.success({view:'pages/cart/view',cart:newCart});
    }

    console.log(cart);

    return exits.success(cart);

    var product = cart.products.findOne({id:inputs.product.string});

    if(!product){

    }

    var sizes = product.findOne({size:inputs.size});

    if(!sizes){

    }

    sizes += inputs.quantity;

    return exits.success(cart);
  }
};