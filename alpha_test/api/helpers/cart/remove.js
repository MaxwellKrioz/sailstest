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
    success: {
      responseType: 'view',
      viewTemplatePath: 'pages/cart/view'
    },
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
    //var cart = await Cart.find({}).populate('customer', {where: { mail: inputs.mail }});
    var req = this.req;
    var res = this.res;

    var customer = await Customers.findOne({mail: inputs.mail}).populate("cart");
    var product = await Product.findOne({id:inputs.product}).populate("sizes");
    var sizeFind = product.sizes.find(o => o.code === inputs.size);
    var entryCost = product.price * inputs.quantity;
    var maxReq = sizeFind.stock;
    var sizeId = sizeFind.id
    /*var cart = await Customers.findOne({mail: inputs.mail})
        .populate("cart")
        .exec(console.log);*/

    if (!customer.cart || customer.cart.length <= 0){
      return exits.invalid({message:"Error loading customer's cart"});
    }else{
      var cart_id = customer.cart.id;
      if(customer.cart[0].products){
        var tmpProducts = customer.cart[0].products;

        var existingPrd = tmpProducts.find(foo => foo.product === inputs.product);
        if(existingPrd){
          var existingSize = existingPrd.sizes.find(foo => foo.size === inputs.size);
          if(existingSize){
            if(existingSize.quantity-inputs.quantity <= 0){
              var filtered = existingPrd.sizes.filter(function(foo) {
                 return foo.size !== inputs.size;
              });
              existingPrd.sizes = filtered;
            }else{
              existingSize.quantity -= inputs.quantity;
            }
          }else{
            existingPrd.sizes.push({size:inputs.size,quantity:inputs.quantity});
          }
        }else{
          tmpProducts.push({
            product:inputs.product,
            sizes:[{size:inputs.size,quantity:inputs.quantity}]
          });
        }
        var totalCost = customer.cart[0].totalCost - entryCost;
        var newCart = await Cart.update({id:cart_id}).set({products:tmpProducts,totalCost:totalCost}).fetch();
        await Sizes.update({id:sizeId}).set({stock:(maxReq+inputs.quantity)});     
      }else{
        return exits.success(customer.cart);
      }
    }
    return exits.success(customer.cart);
  }
};
