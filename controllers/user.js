let models = require("../models");
let bcrypt = require("bcrypt");
const passport = require('passport');
const myPassport = require('../passport_setup')(passport);
let flash = require('connect-flash');

const {
    isEmpty
} = require('lodash');

const {
    validateUser
} = require('../validators/signup');

const generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

exports.show_login = function(req, res, next) {
    if (req.user) {
        res.redirect('/account');
    } else {
        res.render('user/login', {
            title: "Log in",
            formData: {},
            errors: req.flash(),
            user: req.user
        });
    }
};

exports.show_signup = function(req, res, next) {
    if (req.user) {
        res.redirect('/account');
    } else {
        res.render('user/signup', {
            title: "Sign up",
            formData: {},
            errors: {},
            user: req.user
        });
    }
};

const rerender_signup = function(errors, req, res, next) {
    if (req.user) {
        res.redirect('/account');
    } else {
        res.render('user/signup', {
            title: "Sign up",
            formData: req.body,
            errors: errors,
            user: req.user
        });
    }
};

exports.signup = function(req, res, next) {
    let errors = {};
    return validateUser(errors, req).then(errors => {
        if (!isEmpty(errors)) {
            rerender_signup(errors, req, res, next);
        } else {
            return models.User.create({
                email: req.body.email,
                password: generateHash(req.body.password)
            }).then(result => {
                passport.authenticate('local', {
                    successRedirect: req.body.referrer || req.get('Referrer') || "/",
                    failureRedirect: "/signup",
                    failureFlash: true
                })(req, res, next);
            });
        }
    });
};

exports.login = function(req, res, next) {
    console.log(req.body.referrer || req.get('Referrer') || "/");
    passport.authenticate('local', {
        successRedirect: req.body.referrer || req.get('Referrer') || "/",
        failureRedirect: "/login",
        failureFlash: true
    })(req, res, next);
};

exports.logout = function(req, res, next) {
    req.logout();
    req.session.destroy();
    res.redirect(req.body.referrer || req.get('Referrer') || '/');
};

exports.show_account = function(req, res, next) {
    res.render('user/account', {
        title: "My Account",
        user: req.user
    });
}