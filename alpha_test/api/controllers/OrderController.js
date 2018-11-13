/**
 * orderController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
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

