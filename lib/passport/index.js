const passport = require('passport');
const { ErrResponse } = require(`${__base}lib/response`);
// const loggers = require(`${__base}lib/winston`);
// const log = loggers(process.env.NODE_ENV || 'development');

const exchange = require('./exchange');

require('./strategies/basic');
require('./strategies/bearer');

function initialize(options) {
  return passport.initialize(options);
}

function authenticateBearer(req, res, next) {
  bearer('bearer', req, res, next);
}

function bearer(name, req, res, next) {
  return passport.authenticate(name, { session: false }, (err, user, info) => {
    if (err) {
      // log.error(`ERROR: ${err.message}`);
      return next(err);
    }
    if (!user) {
      const message = new RegExp(/error_description="(.*)"/).exec(info);
      // log.error(`ERROR: ${message}`);
      
      return next(new ErrResponse((message && message[1]) || 'Invalid Token'));
    }
    passport.transformAuthInfo(info, req, (err) => {
      if (err) {
        // log.error(`ERROR: ${err.message}`);
        return next(err);
      }
      // req.authInfo = tinfo;
      next();
    });
  })(req, res, next);
}

exports.exchange = exchange;
exports.initialize = initialize;
exports.authenticateBearer = authenticateBearer;
exports.authenticateBasic = passport.authenticate('basic', { session: false });
