let createError = require('http-errors');
const models = require('../models');

exports.isLoggedIn = function(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
};