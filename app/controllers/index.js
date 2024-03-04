'use strict';

const router = require('express').Router();

const passport = require(`${__base}lib/passport`);

module.exports = (app) => {
  app.use(passport.initialize());
  
  router.use('/v1', require('./v1'));

  app.use(router);
};
