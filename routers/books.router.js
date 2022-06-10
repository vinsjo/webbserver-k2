const express = require('express');
const controller = require('../controllers/books.controller');

const router = express.Router();

router
	.get('/', controller.all)
	.post('/', controller.post)
	.get('/:id', controller.get)
	.delete('/:id', controller.delete)
	.put('/:id', controller.put)
	.patch('/:id', controller.patch)
	.all('*', (req, res) => {
		console.log(req.params);
		res.status(405).end();
	});

module.exports = router;
