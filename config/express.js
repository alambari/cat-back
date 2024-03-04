'use strict';

const express = require('express');
const cors = require('cors');
const winston = require('winston');
const compress = require('compression');
const expressWinston = require('express-winston');
const { startTracing, endTracing } = require(`${__base}lib/tracing`);
const { ErrResponse } = require(`${__base}lib/response`);
// require('glob');

module.exports = (app, config) => {
  app.disable('etag');
  app.disable('x-powered-by');
  app.use(cors());
  app.use(compress());

  let logTransport;
  const winstonConsole = new winston.transports.Console({
    json: true,
    colorize: true,
    stringify: true,
    timestamp: true,
    silent: process.env.NODE_ENV === 'test',
  });
  
  const loggers = [];
  switch (app.get('env')) {
    case 'production':
      loggers.push(winstonConsole);
    break;
    case 'test':
      require(`${__base}lib/winston/transports/silent`);
      logTransport = new winston.transports.SilentLogger();
      loggers.push(logTransport);
    break;
    default:
      loggers.push(winstonConsole);
  }

  expressWinston.requestWhitelist.push('body');
  app.use(expressWinston.logger({
    transports: loggers,
    statusLevels: false,
    level: 'info'
  }));

  app.use(express.json());
  app.use(express.urlencoded({
    extended: true,
  }));
  app.use(express.json({ type: 'application/vnd.api+json' }));

  app.get('/ping(.html)?', function(req, res) {
    res.sendStatus(200);
  });

  app.use(startTracing());

  require(`${config.root}/app/controllers`)(app);

  app.use(function(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  app.use(expressWinston.errorLogger({
    transports: loggers
  }));

  app.use(endTracing((err, req, res) => {
    return new ErrResponse(err, res);
  }));
};
