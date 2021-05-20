const usersController = require('../controllers/user.js');
const models = require('../models');

exports.adminAutoLogin = function(req, res, next) {
    if (req.app.get('env') === 'development') {
        models.User.findOne({
            where: {
                email: "admin@cognosco.info"
            }
        }).then(result => {
            if (result) {
                req.body = {
                    email: "admin@cognosco.info",
                    password: "cognosco"
                };
                usersController.login(req, res, next);
            } else {
                next();
            }
        }).catch(er => {
            next();
        });
    } else {
        next();
    }
};