module.exports = {
  inputs: {
  			cart:{
  				type:"string",
  				required: true,
  			},
        customer:{
          type: "string",
          required: true,
        },
        payment: {
          type: "json",
          required: true,
        },
  },

  exits: {
    success: {
      outputFriendlyName: 'yuBOUGHT?'
    },

    invalidCard: {
      description: 'The payment methot is not valid'
    }
  },

  fn: async function(inputs,exits){
      
  }
}
