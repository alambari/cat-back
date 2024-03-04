'use strict';

const path = require('path');
const rootPath = path.normalize(__dirname + '/..');
const env = process.env.NODE_ENV || 'development';

const config = {
	development: {
		root: rootPath,
		app: {
			name: 'edge',
		},
		port: process.env.PORT,
		avnotifier: {
			sender: 'noreply@giftcard.co.id',
			service: 'gmail',
			auth: {
				user: process.env.GMAIL_USER,
				pass: process.env.GMAIL_PASS,
			},
		},
	},

	test: {
		root: rootPath,
		app: {
			name: 'edge',
		},
		port: process.env.PORT,
	},

	production: {
		root: rootPath,
		app: {
			name: 'edge',
		},
		port: process.env.PORT,
		avnotifier: {
			sender: 'noreply@giftcard.co.id',
			service: 'ses',
			auth: {
				accessKeyId: process.env.SES_KEY,
				secretAccessKey: process.env.SES_SECRET,
				region: 'us-west-2',
				rateLimit: 1,
			},
		},
	},

	staging: {
		root: rootPath,
		app: {
			name: 'edge',
		},
		port: process.env.PORT,
		avnotifier: {
			sender: 'noreply@giftcard.co.id',
			service: 'ses',
			auth: {
				accessKeyId: process.env.SES_KEY,
				secretAccessKey: process.env.SES_SECRET,
				region: 'us-west-2',
				rateLimit: 1,
			},
		},
	},
};

module.exports = config[env];
