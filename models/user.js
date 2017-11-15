// mongoose setup, email, password
const mongoose = require('mongoose');
const Schema = mongoose.Schema; // particular fileds that model is going to have
const bcrypt = require('bcrypt-nodejs');

// Define model
const userSchema = new Schema ({
    email: { type: String, unique: true, lowercase: true },
    password: String
});


// on save Hook, encrypt password
// before saving a model, run this function
userSchema.pre('save', function(next) {

    // get access to user model
    const user = this; // user.email, user.password

    // generate a salt, then run callback
    bcrypt.genSalt(10, function(err, salt) {

        if (err) { return next(err); }

        // hash(encrypt) password using salt
        bcrypt.hash(user.password, salt, null, function(err, hash) {

            if (err) { return next(err); }

            // overwrite plain text password, with encrypted password
            user.password = hash;
            next(); // save the model
        });
    });
});

// if passwords are equal
userSchema.methods.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) { return callback(err); }

        callback(null, isMatch);
    });
}



// Create Model Class
const ModelClass = mongoose.model('user', userSchema);

// Export Model
module.exports = ModelClass;