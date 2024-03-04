'use strict';

const router = require('express').Router();

const { 
  exchange, 
  authenticateBasic 
} = require(`${__base}lib/passport`);
// const helper = require(`${__base}lib/passport/helper`);
// const pathRestriction = require(`${__base}lib/path_restriction`);
// const injectClientCode = require(`${__base}lib/client-code`);
// const bruteForce = require(`${__base}lib/middleware/brute-force`);
// const injectHeaderTag = require(`${__base}lib/middleware/headers-tag`);

router.post('/',
  // helper.hijackResponse,
	authenticateBasic,
	// injectClientCode,
  // injectHeaderTag,
  // pathRestriction(),
  // bruteForce(),
  (req, res, next) => {
    req.body = {
      grant_type: 'password',
      ...req.body
    };
    next();
  },
	exchange.token(),
	exchange.errorHandler({ mode: 'indirect' })
);

module.exports = router;