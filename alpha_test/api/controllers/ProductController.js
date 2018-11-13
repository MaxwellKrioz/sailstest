/**
 * ProductController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  list: function(req, res){
		Product.find({}).exec(function(err,products){
			if(err){
				res.send(500,{error:'DB Error'});
			}
			return res.view('pages/products/list',{products:products});
		});
	},
	get: async function(req,res){
		var id = req.param("id");		
		var prd = await sails.helpers.products.getproduct(id);
		var sizes = await sails.helpers.products.getsizes(prd.id);
		return res.view('pages/products/view',{product:prd,sizes:sizes});
	}
};

