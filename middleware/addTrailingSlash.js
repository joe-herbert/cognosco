exports.addTrailingSlash = function(req, res, next) {
    if (req.url.substr(-1) !== '/' && req.url.length > 1) {
        res.redirect(301, req.url + "/");
    } else {
        next();
    }
};