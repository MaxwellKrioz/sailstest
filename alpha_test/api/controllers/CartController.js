/**
 * CartController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  get: async function (req, res) {  	
  	var secId = req.session.userId;
  	var myCustomer = await sails.helpers.customer.getcustomer(false,secId);
  	var myCart = await sails.helpers.cart.get(myCustomer.mail);
  	var productsDetail = [];
  	if(myCart){
  		//console.log("wot",myCart);
  		myCart.products.sort('createdAt DESC');
  		await Promise.all(myCart.products.map(async (entry) => {
  			var product = await sails.helpers.products.getproduct(entry.product);
  			entry.sizes.forEach(function(size){
  				if(product.active){
		  			productsDetail.push({
		  					id: product.id,
							 	size: size.size,
							 	quantity: size.quantity,
							 	name: product.name,
							 	price: product.price,
							 	image: product.image
		  			});
		  		}
  			});  			
			})).then(function(){
				myCart.products = productsDetail;
  			return res.view('pages/cart/view',{cart:myCart});
			});
  	}  	
  },
  update: async function(req,res){
  	var inputs = req.allParams();
  	var secId = req.session.userId;
  	var myCustomer = await sails.helpers.customer.getcustomer(false,secId);

  	switch(inputs.option){
  		case 'plus':
  			var cart = await sails.helpers.cart.add(myCustomer.mail,inputs.id,1,inputs.size);
  		break;

  		case 'minus':
  			var cart = await sails.helpers.cart.remove(myCustomer.mail,inputs.id,1,inputs.size);
  		break;

  		case 'default':
  			return res.redirect('/cart');
 		}

 		return res.redirect('/cart');
  	
  },
  add: async function (req, res){
  	var inputs = req.allParams();
  	var secId = req.session.userId;
  	var myCustomer = await sails.helpers.customer.getcustomer(false,secId);
  	var cart = await sails.helpers.cart.add(myCustomer.mail,inputs.product,inputs.quantity,inputs.size);
  	return res.redirect('/cart');
  },

  remove: async function (req, res){
  	var inputs = req.allParams();
  	console.log(inputs);
  	var secId = req.session.userId;
  	var myCustomer = await sails.helpers.customer.getcustomer(false,secId);
  	var cart = await sails.helpers.cart.remove(myCustomer.mail,inputs.product,inputs.quantity,inputs.size);
  	return res.redirect('/cart');
  }

};

