let models = require('../models');
let validator = require('validator');

const validateCreateWordFields = function(errors, req) {
    for (let param in req.body) {
        if (param !== "modelName" && param !== "pathName" && !validator.isLength(req.body[param], {
                max: 250
            })) {
            errors.title = "The " + param + " field must be less than 250 characters long.";
        }
    }
};

exports.validateWord = function(errors, req) {
    return new Promise(function(resolve, reject) {
        validateCreateWordFields(errors, req);
        resolve(errors);
    });
};