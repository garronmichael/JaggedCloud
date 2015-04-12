var passport = require('./githubConfig.js');

module.exports.signin = passport.authenticate('github');  

module.exports.callback = passport.authenticate('github', {successRedirect: '/'});

module.exports.logout = function(req, res) {
    req.logout();
    req.session.destroy();
    res.redirect('/');
}

module.exports.isAuthenticated = function(req, res) {
  res.send(req.isAuthenticated() ? true : false);
}