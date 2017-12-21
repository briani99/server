const jwt    = require('jsonwebtoken'); 
const User    = require('../../models/User'); 

exports.generateToken = (user) => {
    var token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn : 60*60*24});
    return token;
}

exports.ensureAuthenticated = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
    }
    var token = req.headers.authorization.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: err.message });
        }

        
        User.findOne({_id: decoded.id})
        .then(user => {
            if (!user) return res.status(401).send({ message: 'No User Found' });
            
            req.user = {id: user.id};
            return next();
        })
        .catch(err => {
            return res.status(401).send({ message: err.message });
        }); 
    });
}