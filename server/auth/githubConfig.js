var express = require('express');
var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var User = require('../db/models/userModel.js');

/* Passport session setup.
*   To support persistent login sessions, Passport needs to be able to
*   serialize users into and deserialize users out of the session. Here
*   we store the user's github id when serializing, and find the user by 
*   github id when deserializing.
*/
passport.serializeUser(function(user, done) {
  console.log('Serializing: ', user.github_id);
  done(null, user.github_id);
});

passport.deserializeUser(function(user, done) {
  console.log('Deserializing: ', user);
  done(null, user);
});

/* Use the GitHubStrategy within Passport.
*   Strategies in Passport require a `verify` function, which accept
*   credentials (in this case, an accessToken, refreshToken, and GitHub
*   profile), and invoke a callback with a user object.
*/
passport.use(new GitHubStrategy({
    // github client id and secret should not be stored on your repo and should exist as environmental variables
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CB || 'http://localhost:3000/auth/github/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({ github_id: profile.id }, function(err, user) {
      if(err) {
        console.error('Error: ', err);
      }
      if(!user) {
        console.log(profile);
        User.create({ email: profile._json.email, github_id: profile.id, access_token: accessToken, refresh_token: refreshToken, profile_photo: profile._json.avatar_url }, function(err, user) {
          if(err) {
            console.error('Error: ', err);
          }
          if(user) {
            console.log('Creating user', user);
          }
        })
        .then(function(user) {
          console.log('Saved user', user);
          return done(null, user);
        });
      } else {
        console.log('Found user', user);
        return done(null, user);
      }
    });
  } 
));

module.exports = passport;