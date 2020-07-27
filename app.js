const express = require('express');
const passport = require('passport');
const cors = require('cors');
const app = express();
app.use(cors());
require('./connections/database');
app.use(passport.initialize());
app.use(passport.session());
require('./connections/local');
require('./connections/jwt');
passport.serializeUser(function(user, done){
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', require('./route'));

module.exports = app;
