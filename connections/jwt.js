const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
require('dotenv').config();
const passport = require('passport');

const { client } = require('./database');
const { C, TABLE_NAMES } = require('../utils/constants');

const options = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('JWT'),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JWTStrategy(options, async function (jwtPayload, done) {
    const customers = await client.query(
      `SELECT * FROM ${TABLE_NAMES.CUSTOMER} WHERE ${C.ID}='${jwtPayload[C.ID]}'`
    ).catch(err => {
      done(err);
    });
    if(customers.rows.length > 0) return done(null, customers.rows[0]);
    return done(null, false);
  })
);
