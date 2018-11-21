module.exports = {
  inputs: {
        mail: {type: 'string',required: false,},
        id:{type:'string',required:false}      
  },

  exits: {
    invalid: {
      responseType: 'badRequest',
      description: 'Something went wrong',
    },
  },

  fn: async function(inputs,exits){
    if(!inputs.mail && !inputs.id){
      return  exits.invalid();
    }
    if(inputs.id){
      var customerRegistry = await Customers.findOne({id:inputs.id});      
    }else{
     var customerRegistry = await Customers.findOne({mail:inputs.mail});
    }
    //.intercept('E_UNIQUE', 'sameItem')
    if(!customerRegistry){
      return exits.success(false);
    }

    return exits.success(customerRegistry);
  }
};