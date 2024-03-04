'use strict';

const passport = require('passport');
const { BasicStrategy } = require('passport-http');

const db = require(`${__base}app/models`);
const { ErrResponse } = require(`${__base}lib/response`);

const loggers = require(`${__base}lib/winston`);
const log = loggers(process.env.NODE_ENV || 'development');

passport.use(new BasicStrategy({ passReqToCallback: true },
  async function(req, key, secret, done) {
    try {
      const clientKey = await db.ClientKey.findOne({
        where: {
          key: key,
          secret: secret  
        }
      });
      if(!clientKey) {
        log.error(`[Basic] client key not found`);
        throw new ErrResponse('Client key not found', 401);
      }

      if(!clientKey.isActive) {
        log.error(`[Basic] client key is inactive`);
        throw new ErrResponse('Client key not found', 401);
      }
      done(null, clientKey);
    } catch(err) {
      log.error(`[Basic] client key error -> err: ${err}`);
      done(err);
    }
  }
));
