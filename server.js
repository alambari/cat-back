/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
'use strict';

global.__base = global.__base || __dirname + '/';
const envoodoo = require('envoodoo');

envoodoo(e => {
	if (e) throw e;

	const express = require('express');
	const { config } = require('./config');
	const db       = require('./app/models');

	const app = express();
	require('./config/express')(app, config);

	db.sequelize
		.sync()
		.then(() => {
			app.listen(config.port, () => {
				console.info('EDGE API started');
			});
		})
		.catch((err) => {
			throw err;
		});
});

/* eslint-enable no-console */