function getAjaxContent(url,method = 'GET') {
	$.ajax({
		method: method,
		url:url,
		success: function(data,text){
			return data;
		},
		error: function(req, st, err){
			return err;
		}
	});	
}

function setAjaxContent(data,target){
	target.html(data);
}

$("form.ajax-form button").on("click",function(e){
	e.stopPropagation();
	e.preventDefault();
	console.log("TEST");
});
$("form.ajax-form").on("submit",function(e){
	e.stopPropagation();
	e.preventDefault();
	console.log($(this));
});

