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
      outputFriendlyName: 'Product added to cart'
    },

    outOfStock: {
      name: "outofstock",
      description: 'The selected product is out of stock'
    }
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
    var sizeId = sizeFind.id;
    if(inputs.quantity>maxReq){
      return exits.outOfStock();
    }
    if (!customer.cart || customer.cart.length <= 0){
      //creates cart if doesnt exist
      var newProd = [{
        product:inputs.product,
        sizes:[{size:inputs.size,quantity:inputs.quantity}]
      }];


      var totalCost = entryCost;

      //var finalCost = 0; //TODO with discount
      var newCart = await Cart.create({
        totalCost: totalCost,
        discount: 0,
        customer: customer.id,
        products:newProd
      }).fetch();

      await Sizes.update({id:sizeId}).set({stock:(maxReq-inputs.quantity)});

      return exits.success(newCart);
    }else{

      var cart_id = customer.cart.id;

      if(customer.cart[0].products){
        var tmpProducts = customer.cart[0].products;

        var existingPrd = tmpProducts.find(o => o.product === inputs.product);
        if(existingPrd){
          var existingSize = existingPrd.sizes.find(o => o.size === inputs.size);
          if(existingSize){
            existingSize.quantity += inputs.quantity;
          }else{
            existingPrd.sizes.push({size:inputs.size,quantity:inputs.quantity});
          }
        }else{
          tmpProducts.push({
            product:inputs.product,
            sizes:[{size:inputs.size,quantity:inputs.quantity}]
          });
        }
        var totalCost = customer.cart[0].totalCost + entryCost;
        console.log("pop",totalCost);
        var newCart = await Cart.update({id:cart_id}).set({products:tmpProducts,totalCost:totalCost}).fetch();
        await Sizes.update({id:sizeId}).set({stock:(maxReq-inputs.quantity)});
      }else{
        return exits.success(newCart);
      }
      return exits.success(newCart);
    }
    return exits.success(customer.cart);
  }
};
