const User   = require('../models/User');

exports.users = (req, res) => {
    User.find({})
        .then(users => {
            return res.json(users);
        })
        .catch(err => {
            return err;
        });
    
};

exports.userById = (req, res) => {
    User.findById(req.params.id)
        .then(user => {
            return res.json(user)
        })
        .catch(err =>{
            return err;
        }); 
};

