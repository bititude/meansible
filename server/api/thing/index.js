'use strict';

var express = require('express');
var controller = require('./thing.controller');

var router = express.Router();

// router.get('/', controller.index);
router.post('/', controller.downloadGen, controller.getScript);

module.exports = router;
