//this is used when there is no db, store user only in memory.
//Before authenticating requests, the strategy (or strategies) used by an application must be configured.
//we use local strategy, meaning with a login and password, we can  also use other strategies like facebook, google+ etc.
//As we use local strategy, we have to configure two strategies before we can use them: login and signup

var LocalStrategy   = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
//temporary data store
var users = {};

module.exports = function(passport){

    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {
        console.log('serializing user:',user.username);
        //return the unique ID (username is unique) of user
        return done(null, user.username);
    });

    passport.deserializeUser(function(username, done) {
    //Desieralize user will call with the unique id username provided by serializeuser

        return done(null, users[username]);

    });

    passport.use('login', new LocalStrategy({
            passReqToCallback : true //pass the req object to the callback function next to it
        },
        function(req, username, password, done) { 
            //check if user exists, if user does not exist, i.e. null (!null gives true)
            if(!users[username]){
                console.log('User Not Found with username '+username);
                return done (null, false);
            };
            //check if the password is valid
            if (isValidPassword(users[username],password)){
                return done (null, users[username]);
            }else{
                console.log('Invalid password '+username);
                return done (null, false);
            }
            //done is a call back functions, the 1st argument is err, null means no error; the second is false when login fail, the user when success
        }
    ));

    passport.use('signup', new LocalStrategy({
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            //check if username exist
            if (users[username]){
                console.log('User already exists with username: ' + username);
                return done (null, false);
            };
            users[username]={
                username: username,
                password: createHash(password)
            };
            console.log(users[username].username + ' Registration successful');
            return done(null, users[username]);
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
