const model = require('../models/books.model');

module.exports = {
	all: async (req, res) => {
		const books = await model.all();
		if (!books)
			return res.status(500).json({ message: 'An error occured' });
		res.json(books);
	},
	get: async (req, res) => {
		const { id } = req.params;
		if (!id) return res.status(400).json({ error: 'ID required' });
		const book = await model.get(id);
		if (!book) {
			return res
				.status(404)
				.json({ error: `A book with id ${id} does not exist.` });
		}
		res.json(book);
	},
	delete: async (req, res) => {
		const { id } = req.params;
		if (!id) return res.status(400).json({ error: 'ID required' });
		const changes = await model.delete(id);
		if (!changes) {
			return res
				.status(404)
				.json({ error: `A book with id ${id} does not exist.` });
		}
		res.json({ status: 'deleted' });
	},
};
