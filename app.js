var express = require("express");
var Post = require('./Post.js');

var app = express();

app.configure(function(){
	app.use(express.urlencoded({limit: '3mb'}));
	app.use(express.json({limit: '3mb'}));
	app.use(app.router);
});

app.use('/', express.static(process.cwd() + '/public'));

app.get('/posts', function(req,res){
	Post.find({}).sort({created: -1}).exec(function(err,docs){
		if(err){ res.send('Error ' + err); return; }
		res.send(docs);
	});
});

app.get('/posts/:id', function(req,res){
	Post.findById(req.params.id, function(err,doc){
		if(err){ res.send('Error ' + err); return; }
		res.send(doc);
	});
});

app.post('/posts', function(req,res){
	var postData = req.body;
	var actualDate = Date.now();
	postData.created = actualDate;
	postData.updated = actualDate;
	var newPost = new Post(postData);
	newPost.save(function(err){
		if(err){ res.send('Error ' + err); return; }
		res.send(newPost);
	});
});

app.put('/posts/:postid', function(req,res){
	var postData = req.body;
	var actualDate = Date.now();
	postData.updated = actualDate;
	Post.findByIdAndUpdate(req.params.postid, postData, function(err){
		if(err){ res.send('Error ' + err); return; }
		res.send('ok');
	});
});

app.delete('/posts/:postid', function(req,res){
	Post.findByIdAndRemove(req.params.postid, function(err){
		if(err){ res.send('Error ' + err); return; }
		res.send('ok');
	});
});

app.listen(3000);