//this is used when Mongodb is used as db for storing user
//Before authenticating requests, the strategy (or strategies) used by an application must be configured.
//we use local strategy, meaning with a login and password, we can  also use other strategies like facebook, google+ etc.
//As we use local strategy, we have to configure two strategies before we can use them: login and signup

var LocalStrategy   = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
//Mongodb local
var mongoose=require ('mongoose');
var User=mongoose.model('User');

//temporary data store
//var users = {};

module.exports = function(passport){

    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {
        console.log('serializing user:',user._id);
        //return the unique ID (_id is the unique key created by the db) of user
        return done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
    //Desieralize user will call with the unique id _id provided by serializeuser and return the user which has the id
        User.findById(id, function(err, user){
            console.log('deserealize user' + user._id)
            done(err,user);
        })
    });

    passport.use('login', new LocalStrategy({
            passReqToCallback : true //pass the req object to the callback function next to it
        },
        function(req, username, password, done) { 
            //// check in mongo if a user with username exists or not
            User.findOne({'username': username},function(err, user){
                //pass the first user matching username to the call back
                if(err)
                    return done (err);
                //check if user exists, if not, reject login
                if (!user)
                    return done (null, false);
                
                //check if password is valid
                if (isValidPassword(user,password)){
                    return done (null, user);
                }else{
                    console.log('Invalid password '+username);
                    return done (null, false);
                }
            })
        }
    ))
    
    passport.use('signup', new LocalStrategy({
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            //Mongoose query to find the first user occurance           
            User.findOne ({'username':username}, function(err, user){
                if(err)
                    return done (err);
                //if user exist, we cannot create a new user
                if(user){
                    console.log('User already exists with username: ' + username);
                    return done (null, false);
                }
                //create the new user
                var newUser =new User();
                newUser.username=username;
                newUser.password=createHash(password);
                //save user in db
                newUser.save(function(err){
                    if (err){
                            console.log('Error in Saving user: '+err);  
                            throw err;  
                        }
                    console.log(newUser.username + ' Registration succesful');    
                    return done(null, newUser);    
                });
            })
        }
    ));

    var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);
    };
    // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    };
};
