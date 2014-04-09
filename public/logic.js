$(document).ready(function(){
	$.get('/posts.hbs', function(res){
		var template = Handlebars.compile(res);
		$.getJSON('/posts', function(context){
			var res = template(context);
			$('div#postContainer').append(res);
		});
	});
});

Handlebars.registerHelper('prettyDate', function(date){
	return utils.prettyDate(date);
});