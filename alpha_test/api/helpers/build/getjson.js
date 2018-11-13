
module.exports = {
  inputs: {

  },


  exits: {

  },


  fn: async function (inputs, exits) {
  	const jsonfile = require('jsonfile');
    var file = './assets/json/baseProduct.json'; 
    var entries = [];
    await jsonfile.readFile(file, function (err, obj) {
      if (err) {
        return exits.error(err);
      }
      return exits.success(obj);
    }); 
  }
};