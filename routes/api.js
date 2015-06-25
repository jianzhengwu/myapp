var express = require('express');
var router = express.Router();

/* route middleware*/

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
        return res.send({message:'TODO modify an existing post by using param ' + req.param.id});
    })

    .get(function(req,res){
        return res.send({message:'TODO get an existing post by using param ' + req.param.id});
    })

    .delete(function(req,res){
        return res.send({message:'TODO delete an existing post by using param ' + req.param.id})
    });
    
module.exports = router;
