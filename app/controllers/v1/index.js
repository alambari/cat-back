'use strict';

const router = require('express').Router();

const { authenticateBearer } = require(`${__base}lib/passport`);

router.use('/token', require('./token'));

router.use(authenticateBearer);

router.use('/pets', require('./pets'));
router.use('/doctors', require('./doctors'));
router.use('/medicals', require('./medicals'));
router.use('/pet-owners', require('./pet-owners'));
router.use('/appointments', require('./appointments'));

module.exports = router;
