const express = require('express');
const controller = require('../controllers/books.controller');

const router = express.Router();

router
	.get('/', controller.all)
	.get('/:id', controller.get)
	.delete('/:id', controller.delete);

module.exports = router;
