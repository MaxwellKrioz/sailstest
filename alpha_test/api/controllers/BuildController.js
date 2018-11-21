/**
 * BuildController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {  
	firstInstance: async function(req,res){
		var customer  = await sails.helpers.customer.getcustomer("alpha_test@test.com");
		if(!customer){
			res.redirect('/build');
		}
		res.redirect('/products/list');
	},
	build: async function(req,res){
		var entries = await sails.helpers.build.getjson(); 
		var me = res;   
    var customer  = await sails.helpers.customer.createcustomer(
    	"alpha_test@test.com",
	    "Test",
	    "User",
	    "1234");
    req.session.userId = customer.id;
		await Promise.all(entries.map(async (entry) => {
			var product = await sails.helpers.products.createproduct(entry.name,entry.description,entry.price,entry.image);
			var sizes = await sails.helpers.products.createsizes(entry.sizes,product.id);
		})).then(function(){
			me.redirect('/products/list');
		});
	}
};

