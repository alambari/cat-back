const { rateLimit } = require('express-rate-limit');
const { PostgresStore } = require('@acpr/rate-limit-postgresql');
const database = require(`${__base}config/database.json`); 
const dbCfg = database[process.env.NODE_ENV || 'development'];

const { ErrResponse } = require(`${__base}lib/response`);

module.exports = (path = 'body.username', config = {}) => {
  const db = {};
  if(dbCfg.use_env_variable) {
    const parseUrl = new URL(process.env[dbCfg.use_env_variable]);
    db.host = parseUrl.host.split(':')[0];
    db.port = Number(parseUrl.port);
    db.user = parseUrl.username;
    db.password = parseUrl.password;
    db.database = parseUrl.pathname.substring(1);
  } else {
    db.host = dbCfg.host;
    db.port = 5432;
    db.user = dbCfg.username;
    db.password = dbCfg.password;
    db.database = dbCfg.database;
  }

  return (req, res, next) => {
    const cfg = Object.assign({
      store: new PostgresStore(db, 'BruteForce'),
      windowMs: 15 * 60 * 1000, // 15 minutes
      limit: 3, // Limit each IP to 3 requests per `window` (here, per 15 minutes)
      message: 'Too many request',
      handler: (req, res, next, options) => {
        throw new ErrResponse(options.message, options.statusCode);
      }
    }, config);
  
    return rateLimit(cfg)(req, res, next);
  };
};