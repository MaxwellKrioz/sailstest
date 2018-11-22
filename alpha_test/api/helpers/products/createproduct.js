module.exports = {
  inputs: {
        name:{
          type: "string",
          required: true,
        },
        description:{
          type: "string",
          required: true,
        },
        price: {
          type: "number",
          required: true,
        },        
        image: {
          type: "string",
          required: true,
        }
  },

  exits: {
    invalid: {
      responseType: 'badRequest',
      description: 'Something went wrong',
    },
    sizeWrong: {
      responseType: 'badRequest',
      description: 'Something went wrong with sizes',
    },
    sameItem: {
      statusCode: 409,
      description: 'Duplicate entry, Ignoring.',
    },
  },

  fn: async function(inputs,exits){
    var productObj = {
      name: inputs.name,
      description: inputs.description,
      price: inputs.price,
      image: inputs.image,
    };    
    var productRegistry = await Product.create(productObj)
    .tolerate('E_UNIQUE', function(){
      console.log("Match ignored");
    })
    //.intercept({name: 'UsageError'}, 'invalid')
    .fetch();   
    //var tetra = await ProductSizes.create(sizesObj).fetch();    
    return exits.success(productRegistry);
  }
};