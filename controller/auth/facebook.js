'use strict';
var User = require('../../models/User.js');
var request = require('request');
var tokens = require('./tokens');

exports.authenticate = (req, res) => {
    var accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
    var graphApiUrl = 'https://graph.facebook.com/v2.5/me';
    var params = {
        code: req.body.code,
        redirect_uri: req.body.redirectUri,
        client_id: req.body.clientId,
        client_secret: process.env.FACEBOOK_SECRET
    };
    // Step 1. Exchange authorization code for access token.
    request.get({ url: accessTokenUrl, qs: params, json: true }, (err, response, accessToken) => {
        if (response.statusCode !== 200) {
            console.log(response);
            return res.status(500).send({ message: accessToken.error.message });
        }
        // Step 2. Retrieve profile information about the current user.
        request.get({ url: graphApiUrl, qs: accessToken, json: true }, (err, response, profile) => {
            if (response.statusCode !== 200) {
                return res.status(500).send({ message: profile.error.message });
            }
            // Step 3. Create a new user account or return an existing one.
            User.findOne({ 'facebook.id': profile.id })

            .then(existingUser => {        
                    //Later we should check if there is a token and user is logged on and connect accounts
                    if (existingUser) {
                        var token = tokens.generateToken(existingUser);
                        return res.status(200).send({ token: token });

                    }else{
                        var user = new User();
                        user.facebook.id = profile.id;
                        user.avatar = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
                        user.username = profile.name;
                    
                        user.save()
                        .then(user => {
                            var token = tokens.generateToken(user);
                            return res.status(200).send({ token: token });
                        })
                        .catch(err => {
                            return res.status(500).send({ message: err.message });
                        });
                    }
            })
            .catch((err) => {
                    return res.status(500).send({ message: err.message });
            });
        });
    });
};

