const express = require('express');
const controller = require('../controllers/books.controller');

const router = express.Router();

router
	.get('/', controller.all)
	.post('/', controller.post)
	.get('/:id', controller.get)
	.delete('/:id', controller.delete)
	.put('/:id', controller.put)
	.patch('/:id', controller.patch);

module.exports = router;
