'use strict';

const winston = require('winston');

const format = {
  colorize: true,
  json: true,
  stringify: true,
  timestamp: true
};

winston.loggers.add('developmentLogger', {
  transports: [
    new winston.transports.Console(format)
  ]
});

winston.loggers.add('testLogger', {
  transports: [
    new winston.transports.Console({
      silent: true
    })
  ]
});

winston.loggers.add('stagingLogger', {
  transports: [
    new winston.transports.Console(format),
  ]
});

winston.loggers.add('productionLogger', {
  transports: [
    new winston.transports.Console(format),
  ]
});

winston.loggers.add('redisLogger', {
  transports: [
    new winston.transports.Console(format),
  ]
});

function getLogger(env) {
  env = env || 'development';
  return winston.loggers.get(`${env}Logger`);
}

module.exports = getLogger;
