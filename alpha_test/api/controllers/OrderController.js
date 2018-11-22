/**
 * orderController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
	validation: async function(req, res) {
		// Make sure this is a socket request (not traditional HTTP)
    if (!req.isSocket) {return res.badRequest();}
    //Do stuff

    var inputs = req.body;
    var customerId = req.session.userId;
    var customer = await Customers.findOne({id:customerId}).populate("cart");
    var cart = customer.cart[0];
    var result = [];


    console.log(inputs);
		var payment = await sails.helpers.orders.validate(
			inputs.card_number,
			inputs.exp_year,
			inputs.exp_month,
			inputs.nip,
			inputs.name
		);    

		var order = false;
		var status = '';
		var message = "Everything Good";

		if(payment){

			order = await sails.helpers.orders.create(
				cart.id,
				customer.id,
				payment
			).tolerate(function(err,val){
				return res.ok({
	        status: "error",
	        response: result,
	        message:err
		    });
			});
		}else{
			return res.ok({
        status: "error",
        response: result,
        message:"Invalid Payment method"
	    });
		}

    return res.ok({
        status: "success",
        response: order,
        message:"Order created"
    });
  },
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

  	return "variantus controllus";
  },

	list: async function(req, res){
		var customerId = req.session.userId;
    var customer = await Customers.findOne({id:customerId}).populate("orders");    
    if(customer.orders && customer.orders.length > 0){
    	console.log(customer.orders);
    	return res.view('pages/customer/orders',{orders:false});
    }
		
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

