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
    var productSize = await Product.findOne({id:inputs.product}).populate("sizes");
    var sizeFind = productSize.sizes.find(o => o.code === inputs.size);
    var maxReq = sizeFind.stock;
    var sizeId = sizeFind.id;
    if(inputs.quantity>maxReq){
      return exits.invalid(false,{message:'The product is out of stock!'});
    }

    if (!customer.cart || customer.cart.length <= 0){
      //creates cart if doesnt exist
      var newProd = [{
        product:inputs.product,
        sizes:[{size:inputs.size,quantity:inputs.quantity}]
      }];

      var cost = await Product.findOne({
        where:{id:inputs.product},
        select:['price']
      });

      var totalCost = cost.price;

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

        var newCart = await Cart.update({id:cart_id}).set({products:tmpProducts}).fetch();
        await Sizes.update({id:sizeId}).set({stock:(maxReq-inputs.quantity)});
        console.log("Update",newCart);      
      }else{
        return exits.success(customer.cart);
      }           
      return exits.success(newCart); 
    }
    return exits.success(cart);
  }
};