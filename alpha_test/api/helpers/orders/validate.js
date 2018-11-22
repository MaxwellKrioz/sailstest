module.exports = {
  inputs: {
  			card:{
  				type:"number",
  				required: true,
  			},
        year:{
          type: "number",
          required: true,
        },
        month:{
          type: "number",
          required: true,
        },
        nip: {
          type: "number",
          required: true,
        },
        name: {
        	type: "string",
          required: true,
        }
  },

  exits: {
    success: {
      outputFriendlyName: 'payment aproved'
    },

    invalidCard: {
      description: 'The payment methot is not valid'
    }
  },

  fn: async function(inputs,exits){
  		var entries = await sails.helpers.build.getjson('validcards'); 
  		var isValid = entries.find(
  			o => o.card == inputs.card &&
  			o.nip == inputs.nip &&
  			o.year	== inputs.year &&
  			o.month == inputs.month
			);
  		console.log("DARTAÑAN---------------------------------------");
  		console.log(entries);
  		console.log(inputs);
			console.log(isValid);
      // Do something magical and return a valid response      
      setTimeout(function() {
      	if(!isValid){
      		return exits.invalidCard('The payment methot is not valid');
      	}else{
	      	return exits.success(inputs);
	      }
      },3000);
  }
}
