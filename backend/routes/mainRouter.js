var express = require('express');
var router = express.Router();

const shortRouter = require('./shortRouter');
const redirectRouter = require('./redirectRouter');
const userRouter = require('./userRouter');
const basketRouter = require('./basketRouter');

router.use('/user', userRouter);
router.use('/short', shortRouter);
router.use('/basket', basketRouter);
router.use('/', redirectRouter);


module.exports = router;
