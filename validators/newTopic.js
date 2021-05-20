let models = require('../models');
let validator = require('validator');

const validateCreateTopicFields = function(errors, req) {
    if (!validator.isAscii(req.body.title)) {
        errors.title = "Invalid characters in title, please try again.";
    }
    if (!validator.isLength(req.body.title, {
            min: 2,
            max: 250
        })) {
        errors.title = "Please ensure your title is clear and between 2 and 250 characters long.";
    }
    if (req.body.description !== "" && !validator.isAscii(req.body.description)) {
        errors.description = "Invalid characters in description, please try again.";
    }
    if (!validator.isLength(req.body.description, {
            max: 250
        })) {
        errors.description = "Please ensure your description is clear and less than 250 characters long.";
    }
    if (req.body.content !== "" && !validator.isAscii(req.body.content)) {
        errors.content = "Invalid characters in content, please try again.";
    }
    if (req.body.parentId !== "" && !validator.isUUID(req.body.parentId, 4)) {
        errors.parentId = "Invalid ID for parent, please try again.";
    }
};

exports.validateTopic = function(errors, req) {
    return new Promise(function(resolve, reject) {
        validateCreateTopicFields(errors, req);
        return models.Topic.findOne({
            where: {
                title: req.body.title
            }
        }).then(u => {
            if (u !== null) {
                errors.title = "Title is already in use. Please check if this topic already exists before creating a new one.";
            }
            resolve(errors);
        });
    });
};