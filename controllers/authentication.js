const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');


// takes users ID, encode it with our secret
function tokenForUser(user) {
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = function(req, res, next) {
    // user has email and password authorized
    // need to give them a token
    res.send({ token: tokenForUser(req.user) });
}


exports.signup = function(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(422).send({ error: 'You must provide an email and password.' });
    }

    // see if user with given email exists
    User.findOne({ email: email }, function(err, existingUser) {
        if (err) { return next(err); }

        // if user with email exists return error
        if (existingUser) {
            return res.status(422).send({ error: 'Email Address already exists' });
        }

        // if user without email does not exist, create and save user
        const user = new User({
            email: email,
            password: password
        });

        user.save(function(err) {
            if (err) { return next(err); }

            // respond to request, user was created
            res.json({ token: tokenForUser(user) });
        });
    });
}