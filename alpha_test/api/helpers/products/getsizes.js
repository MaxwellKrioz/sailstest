module.exports = {
  inputs: {
        id: {
          type: "string",
          required: true,
        }
  },

  exits: {
    invalid: {
      responseType: 'badRequest',
      description: 'Something went wrong',
    },

    notFound: {
      statusCode: 404,
      description: 'Request Not Found',
    },
  },

  fn: async function(inputs,exits){
    // Run the query
    var sizes = await Sizes.find({      
      product: inputs.id
    }).intercept({name: 'UsageError'}, 'invalid');

    // If no users were found, trigger the `noUsersFound` exit.
    if (!sizes || sizes.length === 0){
       return exits.success(false);
    }

    // Otherwise return the records through the `success` exit.
    return exits.success(sizes);
    
  }
};
