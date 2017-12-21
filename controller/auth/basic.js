'use strict';
var User = require('../../models/User.js');
var tokens = require('./tokens');

exports.login = (req, res) => {
    
    User.findOne({ 'email' :  req.body.email })
    .then(user => {
        if (!user) 
            return res.status(400).send({ message: 'User not found' });
                
        // Make sure the password is correct
        user.verifyPassword(req.body.password, function(err, isMatch) {
            if (err) 
                return res.status(500).send({ message: err.message });
            // Password did not match
            if (!isMatch) 
                return res.status(400).send({ message: 'Password did not match' });
            // Success
            var token = tokens.generateToken(user);
            return res.status(200).send({ token: token });

        });
    })
    .catch(err => {
        return res.status(500).send({ message: err.message });
    });  
}

exports.signup = (req, res) =>  {
    
    User.findOne({'email': req.body.email})
        .then(existingUser => {
            if (existingUser){
                
                    return res.status(400).send({ message: 'Email already used' });    
            } 
            else {
                // create the user
                var newUser = new User();
                newUser.email = req.body.email;
                newUser.password = req.body.password;

                newUser.save()
                .then(newUser => {
                    var token = tokens.generateToken(newUser);
                    return res.status(200).send({ token: token });
                })
                .catch(err => {
                    return res.status(500).send({ message: err.message });
                }); 
            }
        })
        .catch(err => {
            return res.status(500).send({ message: err.message });
        });                      
}
