var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');


/* route middleware*/
var authentification = function(req, res, next){
    //next is a function which leads to the next middleware (reason the order of middleware is important) or to the route handler
    if (req.method==='GET')
        return next(); //allow get request for all
    if(req.isAuthenticated())
        return next(); //allow get, post and other methods for authenticated users
    return res.redirect('/#login'); //deny access and send requester to the login page
};
//route middlewares apply only for router, so we do router.use
//Register the authentication middleware, so that it will be executed before all route handlers with /posts 
router.use('/posts', authentification);

//api for all post
router.route('/posts')
//returns an instance of a single route which you can then use to handle HTTP
//verbs with optional middleware. 
//Use router.route() to avoid duplicate route naming and thus typo errors.
//below we define http CRUD: get (read), post (create), put (update) and delete 

    .get(function(req, res) {
        //Get all the posts in the database
        Post.find(function(err, posts){
            if (err)
                return res.send('500', err); //http code 500 means server error
            return res.send(posts); //use return to stop execution after res.send(), the return value does not matter
        });
    })
    .post(function(req,res){
        //create a new post
        var newPost = new Post();
        newPost.text = req.body.text;
        newPost.created_by = req.body.created_by;
        newPost.save(function(err, post) {
            if (err)
                return res.send(500, err);
        });
    })
    .delete (function(req,res){
        //TODO delete all post
        Post.remove(function(err) {
            if (err)
                return res.send(err);
            return res.json("deleted :(");
        });
    })
    .put (function(req,res){
        //not allowed
        res.send ({message: "you cannot update a record without a recored ID"});
    });

//api for a specfic post
router.route('/posts/:id')
	//update a post
	.put(function(req,res){
	    Post.findById(req.params.id, function(err,post){
	        if(err)
                return res.send(err);
            post.text = req.body.text;
            post.created_by = req.body.created_by;
            //just save the document, it will be saved under the same _id
            post.save(function(err, post) {
                if (err)
                    return res.send(500, err);
            return res.json(post); //see above, return does not matter so much, it is only a way to stop the function after res.jason
            });
	    });
	})
	.get(function(req,res){
	    Post.findById(req.params.id, function(err, post){
	        if (err)
	           return res.send('500', err);
	        if (!post)
	           return res.send({message: "no result"})
	        return res.send(post);
	    });
	})
	.delete(function(req,res){
	    Post.remove({_id: req.params.id}, function(err){
	       if (err)
	            return res.send('500', err);
	       return res.send('deleted :(') //res.json and res.send are identical when an object or array is passed, but res.json() will also convert non-objects, such as null and undefined, which are not valid JSON.
	    });
	});

module.exports = router;
