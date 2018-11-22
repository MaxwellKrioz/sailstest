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
    var customer = await Customers.findOne({id:customerId}).populate("cart",{where: {active: 'true'}});
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
		var status = 'success';
		var message = "Everything Good";

		if(payment){
			order = await sails.helpers.orders.create(
				cart.id,
				customer.id,
				payment
			).tolerate(function(err,val){
				message="Error:"+err;
				status ='error';
			});
		}else{
				status ='error';
        message="Invalid Payment method";
		}
		
		return res.ok({
      status: status,
      response: order,
      message:message
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
  	if(req.params && req.params.id){
  		var order = await Orders.findOne({id:req.params.id});
			if(order && order.status =='success'){  		  		
				await Orders.update({id:req.params.id}).set({status:"placed"});
	  		return res.view('pages/orders/success',{order:order});
	  	}else{
	  		res.redirect("/order/list");
	  	}
  	}else{
  		res.redirect("/order/list");
  	}  	
  },

	list: async function(req, res){
		var customerId = req.session.userId;
    var customer = await Customers.findOne({id:customerId}).populate("orders");        
    if(customer.orders && customer.orders.length > 0){
    	await Promise.all(customer.orders.map(async (entry) => { 
    		var cart = await sails.helpers.cart.get(false,entry.cart);    		
    		entry.cartValue=cart;
    	})).then(function(){    		
    		return res.view('pages/orders/list',{orders:customer.orders});		
    	});
    }else{
    	return res.view('pages/orders/list',{orders:false});
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

