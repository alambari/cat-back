const router = require('express').Router();

router.get('/', require('./list'));
router.get('/:id', require('./show'));
router.post('/', require('./create'));

router.patch('/:id/set-status', require('./set-status'));

module.exports = router;
