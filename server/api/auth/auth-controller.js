/*jshint node:true */
'use strict';

var authController = {};

authController.getUser = function (req, res) {
  if (req.user && req.user.id) {
    res.json({
      userId: req.user.id,
      login: req.user.login,
      url: req.user.url,
      avatarUrl: req.user.avatarUrl
    });
    return;
  }
  res.json({
    userId: null,
    login: null,
    url: null,
    avatarUrl: null
  });
};

authController.logout = function (req, res) {
  req.logout();
  res.redirect('/');
};

authController.login = function (req, res) {
  'res redirect - login'.log();
  res.redirect('/');
};

module.exports = authController;
