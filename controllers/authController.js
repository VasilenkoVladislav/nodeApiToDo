const config = require('../config/database');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.signUp = (req, res) => {
    if(!req.body.email || !req.body.password) {
        res.json({error: 'Please pass username and password.'});
    } else {
        const newUser = new User({
            email: req.body.email,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        });
        newUser.save((err) => {
            if (err) {
                return res.send({error: 'Username already exists.'});
            }
            const token = jwt.sign({data: newUser}, config.secret, {
                expiresIn: 604800 * 2 // 2 week
            });
            // return the information including token as JSON
            res.status(201).json(
                {
                    token: 'JWT ' + token,
                    user: {
                        _id: newUSer._id,
                        email: newUser.email,
                        firstName: newUser.firstName,
                        lastName: newUser.lastName,
                        createdAt: newUser.createdAt
                    }
                });
            });
    }
};

exports.signIn = (req, res) => {
    User.findOne({email: req.body.email}, (err, user) => {
        if (err) throw err;
        if (!user) {
            res.status(401).send({error: 'Authentication failed. User not found.'});
        } else {
            // check if password matches
            user.comparePassword(req.body.password, (err, isMatch) => {
                if (isMatch && !err) {
                    // if user is found and password is right create a token
                    const token = jwt.sign({data: user}, config.secret, {
                        expiresIn: 604800 // 1 week
                    });
                    // return the information including token as JSON
                    res.status(200).json(
                        {
                            token: 'JWT ' + token,
                            user: {
                                _id: user._id,
                                email: user.email,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                createdAt: user.createdAt
                            }
                    });
                } else {
                    res.status(401).send({error: 'Authentication failed. Wrong password.'});
                }
            });
        }
    });
};

exports.validateToken = (req, res) => {
    res.json(
        {
            user: {
                email: req.user.email,
                firstName: req.user.firstName,
                lastName: req.user.lastName
            }
        });
};
