var express = require('express');
var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var User = require('../db/models/userModel.js');

var GITHUB_CLIENT_ID =  process.env.GITHUB_CLIENT_ID;
var GITHUB_CLIENT_SECRET =  process.env.GITHUB_CLIENT_SECRET;

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete GitHub profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
  console.log('Serializing: ', user.github_id);
  done(null, user.github_id);
});

passport.deserializeUser(function(user, done) {
  console.log('Deserializing: ', user);
  done(null, user);
});

// Use the GitHubStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and GitHub
//   profile), and invoke a callback with a user object.
passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CB || 'http://localhost:3000/auth/github/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    // my code: 
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

    // asynchronous verification, for effect...
    // process.nextTick(function () {


      
      // To keep the example simple, the user's GitHub profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the GitHub account with a user record in your database,
      // and return that user instead.
      // return done(null, profile);
    // });
  } 
));

module.exports = passport;