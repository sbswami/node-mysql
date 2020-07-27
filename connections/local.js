const LocalStrategy = require('passport-local').Strategy;
require('dotenv').config();
const passport = require('passport');
const bcrypt = require('bcryptjs');

const { client } = require('./database');
const { C, TABLE_NAMES } = require('../utils/constants');
const logger = require('./logger');

const options = {
  usernameField: process.env.USERNAME_FIELD,
  password: process.env.PASSWORD_FIELD,
};

passport.use(
  new LocalStrategy(options, async (email, password, done) => {
    const customers = await client.query(`SELECT * FROM ${TABLE_NAMES.CUSTOMER} WHERE ${C.EMAIL}='${email}'`)
    .catch( err => {
      done(err);
    });
    logger.info(customers);
    if (customers.rows.length > 0) {
      const customer = customers.rows[0];
      return bcrypt.compare(password, customer[C.PASSWORD], function (err, isMatch) {
        if (err) return done(err);
        if (isMatch) return done(null, customer);
        return done(null, false);
      });
    }
    done(null, false);
  })
);
