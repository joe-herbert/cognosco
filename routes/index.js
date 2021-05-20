let express = require('express');
let router = express.Router();
let index = require('../controllers/index');
let user = require('../controllers/user');
let { adminAutoLogin } = require('../middleware/adminAutoLogin');
let { isLoggedIn } = require('../middleware/isLoggedIn');
let { isAdmin } = require('../middleware/isAdmin');
let { addTrailingSlash } = require('../middleware/addTrailingSlash');

//index
router.get('/', index.show_index);
router.get('/learn/:topic_name', addTrailingSlash, index.show_topic);
router.get('/learn/**/:topic_name', addTrailingSlash, index.show_topic);
router.get('/topics', index.show_topics);
router.post('/newTopic', isAdmin, index.create_new_topic);
router.post('/newWord', isAdmin, index.create_new_word);
router.get('/contribute', index.show_contribute);
router.get('/languages', index.show_languages);
router.post('/newLanguage', isAdmin, index.create_new_language);

//user
router.get('/login', adminAutoLogin, user.show_login);
router.get('/signup', user.show_signup);
router.get('/account', isLoggedIn, user.show_account);
router.post('/login', user.login);
router.post('/signup', user.signup);
router.post('/logout', user.logout);
router.get('/logout', user.logout);

module.exports = router;