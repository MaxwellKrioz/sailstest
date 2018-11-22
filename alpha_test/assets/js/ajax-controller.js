function form_data($form){
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function(n, i){
        indexed_array[n['name']] = n['value'];
    });

    return indexed_array;
}

function ajax_form(action,method,data){

}


function ajax_request(){

}


$(function(){
  console.log("ready"); 
  $("form.ajax-form").on("submit", function(e){
    if(e){
      e.preventDefault();
      e.stopPropagation();            
    }
    var myForm = $(this);
    var action = myForm.attr("action");
    var method = myForm.attr("method");
    //???
    var data = form_data(myForm);
		var myButton = $(myForm).find('button[type="submit"]');

		myButton.addClass("disabled");		

    io.socket.post('/order/validation', data, function (resData, jwres){
			myButton.removeClass("disabled");
			window.location.replace("/order/list");
    });
    /*io.socket.get('/order/validation', function gotResponse(data, jwRes){
	  	console.log("emarcys protopopoto",jwRes);
	  });*/
//    var responseType= myForm.data("response-type");

  });
});