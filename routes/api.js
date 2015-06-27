var express = require('express');
var router = express.Router();

/* route middleware*/
//route middlewares apply only for route, so we do router.use
router.use(function(req, res, next){
    //next is a function which leads to the next middleware (reason the order of middleware is important) or to the route handler
    if (req.method==='GET')
        return next(); //allow get request for all
    if(req.isAuthenticated())
        return next(); //allow get, post and other methods for authenticated users
    return res.redirect('/#login') //deny access and send requester to the login page
});

//api for all post
router.route('/posts')
//returns an instance of a single route which you can then use to handle HTTP
//verbs with optional middleware. 
//Use router.route() to avoid duplicate route naming and thus typo errors.
//below we define http CRUD: get (read), post (create), put (update) and delete 

    .get(function(req, res) {
        //TODO get all the posts in the database
        //res.render('index', { title: 'Express' });
        res.send({message:"TODO get all the posts in the database"});
    })
    .post(function(req,res){
        //TODO create a new post
        res.send({message: "TODO create a new post in database"});
    })
    .delete (function(req,res){
        //TODO delete all post
        res.send({message: "delete all posts"})
    })
    .put (function(req,res){
        //not allowed
        res.send ({message: "you cannot update a record without a recored ID"})
    });

//api for a specfic post
router.route('/posts/:id')

	//create
	.put(function(req,res){
		return res.send({message:'TODO modify an existing post by using param ' + req.params.id});
	})

	.get(function(req,res){
		return res.send({message:'TODO get an existing post by using param ' + req.params.id});
	})

	.delete(function(req,res){
		return res.send({message:'TODO delete an existing post by using param ' + req.params.id})
	});

    
module.exports = router;
