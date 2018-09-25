// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var client = require('./User');
// Schema for the model

var TranactionSchema = new mongoose.Schema({
    
    description : {type: String},
    item        : {type: String},
    client      : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    value       : {type: Number},
    date        : {type: Date, default: Date.now},
      
    created_at  : {type: Date, default: Date.now},
    updated_at  : {type: Date, default: Date.now}
    
});


// Create a User mongoose model based on the UserSchema
var Transaction = mongoose.model('Transaction', TranactionSchema);

// Export the User model
module.exports = Transaction;