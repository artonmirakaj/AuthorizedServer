// authenticate a user when they attempt to go to a route that requires authentication
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');
const User = require('../models/user');
const config = require('../config');



// create local strategy
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
    // verify email and password
    // call done if correct email and password
    // otherwise call done with false
    User.findOne({ email: email }, function(err, user) {
        if (err) { return done(err); }

        if (!user) { return done(null, false); }

        // compare passwords
        user.comparePassword(password, function(err, isMatch) {
            if (err) { return done(err); }

            if(!isMatch) { return done(null, false); }

            return done(null, user);
        });

    });
});


// set up options for jwt strategy
const jwtOptions = {
    // whenever a request comes in, and we want passport to handle it
    // it needs to look at the request header called authorization to find the token
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    // tell jwt the secret to decode token
    secretOrKey: config.secret
};

// create jwt strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
    // see if user ID in the payload exists in our DB
    // if does call done with that other 
    // otherwise call done without a user object
    User.findById(payload.sub, function(err, user) {
        if (err) { return done(err, false); }

        if (user) { // if found user
            done(null, user);
        }
        else { // if no user
            done(null, false);
        }
    });
});

// tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);