let models = require('../models');
let validator = require('validator');

const validateCreateLanguageFields = function(errors, req) {
    if (!validator.isAscii(req.body.dbName)) {
        errors.dbName = "Invalid characters, please try again.";
    } else if (!models[req.body.dbName]) {
        errors.dbName = "Model could not be found, please try again.";
    } else {
        if (!validator.isAscii(req.body.title)) {
            errors.title = "Invalid characters, please try again.";
        }
        let model = models[req.body.dbName];
        if (!validator.isAscii(req.body.baseColumn)) {
            errors.baseColumn = "Invalid characters, please try again.";
        } else if (!model.rawAttributes[req.body.baseColumn]) {
            errors.baseColumn = "Column could not be found, please try again.";
        }
        if (!validator.isAscii(req.body.primaryColumn)) {
            errors.primaryColumn = "Invalid characters, please try again.";
        } else if (!model.rawAttributes[req.body.primaryColumn]) {
            errors.primaryColumn = "Column could not be found, please try again.";
        }
        if (req.body.secondaryColumn) {
            if (!validator.isAscii(req.body.secondaryColumn)) {
                errors.secondaryColumn = "Invalid characters, please try again.";
            } else if (!model.rawAttributes[req.body.secondaryColumn]) {
                errors.secondaryColumn = "Column could not be found, please try again.";
            }
        }
    }
    if (!validator.isAscii(req.body.voice)) {
        errors.voice = "Invalid characters, please try again.";
    }
};

exports.validateLanguage = function(errors, req) {
    return new Promise(function(resolve, reject) {
        validateCreateLanguageFields(errors, req);
        resolve(errors);
    });
};