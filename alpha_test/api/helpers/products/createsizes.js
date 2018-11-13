module.exports = {
  inputs: {
        sizes:{
            type: "json",      
            required: true
        },
        product:{
            type: "string",      
            required: true
        }
  },

  exits: {
    invalid: {
      responseType: 'badRequest',
      description: 'Something went wrong',
    },
    sameItem: {
      statusCode: 409,
      description: 'Duplicate entry, Ignoring.',
    },
  },

  fn: async function(inputs,exits){
  	await Promise.all(inputs.sizes.map(async (size) => {  		
  		var code = Object.keys(size)[0];
  		var stock = size[code];
  	
			var sizesObj = {
	      code: code,
	      stock: stock,
	      product: inputs.product
	    };  
	   
	    var productRegistry = await Sizes.create(sizesObj)
	    //.intercept('E_UNIQUE', 'sameItem')
	    //.intercept({name: 'UsageError'}, 'invalid')
	    .fetch();
		})).then(function(){
			return exits.success();
		});
    //.intercept('E_UNIQUE', 'sameItem')
    //.intercept({name: 'UsageError'}, 'invalid');       
  }
};
