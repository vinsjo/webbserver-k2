const express = require('express');
const controller = require('../controllers/books.controller');

const router = express.Router();

router.get('/', controller.getAll).get('/:id', controller.getSingle);

module.exports = router;
