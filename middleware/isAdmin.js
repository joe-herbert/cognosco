let createError = require('http-errors');

exports.isAdmin = function(req, res, next) {
    if (req.user && req.user.isAdmin == true) {
        next();
    } else {
        next(createError(404, "Page does not exist."));
    }
};