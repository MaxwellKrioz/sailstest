/**
 * ProductController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  list: async function(req, res){
		var list = await Product.find({}).populate("sizes",{sort:"code DESC"});
		return res.view('pages/products/list',{products:list});			
	},
	get: async function(req,res){
		var id = req.param("id");		
		var prd = await sails.helpers.products.getproduct(id);
		var sizes = await sails.helpers.products.getsizes(prd.id);
		return res.view('pages/products/view',{product:prd,sizes:sizes});
	}
};

