/**
 * orderController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  create: async function(req,res){
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
  			return res.view('pages/orders/create',{cart:myCart});
			});
  	}
  },

  finish: async function(req,res){
  	var inputs = req.body;
  	var secId = req.session.userId;
  },

	list:function(req, res){
		var customer = req.param("customerId");
		Orders.find({
			where:{"customer.id":customer}			
		}).exec(function(err,products){
	  		if(err){
	  			res.status(500).view('500',{error:"DB Error 01"});
	  		}
	  		return res.view('pages/customer/orders',{products:products});
	  	});
	},
	get:function(req, res){
		var customer = req.param("customerId");
		var id = req.param("id");
		Orders.find({
			where:{"customer.id":customer},
			and:{"id":id}
		}).exec(function(err,products){
	  		if(err){
	  			res.status(500).view('500',{error:"DB Error 02"});
	  		}
	  		return res.view('pages/customer/orders',{products:products});
	  	});
	},
};

