// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// Schema for the model
var UserSchema = new mongoose.Schema({
    
    email: {type: String},
    username:  {type: String},
    password: {type: String},
    firstName: {type: String},
    lastName: {type: String},
      
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now},
    
    facebook: {
        id: {type: String},
        token: {type: String}
    },
    avatar: {type: String}
    
    
});


// Before Saving, Check and Hash the password if changed
UserSchema.pre('save', function(next){
    console.log(this);
    if (this.isModified('password')) {
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(this.password, salt);
        this.password = hash;
    }
  
    now = new Date();
    this.updated_at = now;
    if(!this.created_at) {
      this.created_at = now;
    }
    next();
});

// Compare the Hashed Passwords
UserSchema.methods.verifyPassword = function(password, next) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) return next(err);
    next(null, isMatch);
  });
};

// Create a User mongoose model based on the UserSchema
var User = mongoose.model('User', UserSchema);

// Export the User model
module.exports = User;