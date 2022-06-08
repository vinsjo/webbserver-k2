const model = require('../models/books.model');
const { isNum } = require('x-is-type');

async function getAll(req, res) {
	const books = await model.getAll();
	if (!books) return res.status(500).json({ message: 'An error occured' });
	res.json(books);
}

async function getSingle(req, res) {
	const { id } = req.params;
	if (!id) return res.status(400).json({ error: 'ID required' });
	const book = await model.getSingle(id);
	if (!book)
		return res
			.status(404)
			.json({ error: `A book with id ${id} does not exist.` });
	res.json(book);
}

module.exports = { getAll, getSingle };
