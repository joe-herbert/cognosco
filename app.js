const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const session = require('express-session');
const models = require('./models');
const flash = require("connect-flash");
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
require('./passport_setup')(passport);

const app = express();
const port = 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.locals.filters = {
    'convert': function(text, options) {
        return text;
    }
};

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static('public'));

app.use(session({
    secret: 'shh it\'s a secret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = (req.app.get('env') === 'development' || (req.user && req.user.isAdmin)) ? err : {status: err.status};

    // render the error page
    res.status(err.status || 500);
    res.render('error', {
        title: err.message,
        user: req.user
    });
});

return models.sequelize.sync().then(result => {
    app.listen(port, () => console.log(`cognosco listening at ${__dirname}:${port}`));
});