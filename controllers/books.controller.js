const model = require('../models/books.model');

const notFoundID = (res, id) => {
	res.status(404).json({ error: `A book with id '${id}' does not exist.` });
};

const emptyBodyResponse = (res) => {
	res.status(400).json({ error: "Request body can't be empty" });
};

module.exports = {
	all: async (req, res) => {
		const books = await model.all();
		if (!books)
			return res.status(500).json({ message: 'An error occured' });
		res.json(books);
	},
	get: async (req, res) => {
		const { id } = req.params;
		if (!id) return;
		const book = await model.get(id);
		if (!changes) return notFoundID(res, id);
		res.json(book);
	},
	delete: async (req, res) => {
		const { id } = req.params;
		if (!id) return;
		const changes = await model.delete(id);
		if (!changes) return notFoundID(res, id);
		res.json({ status: 'deleted' });
	},
	put: async (req, res) => {
		const {
			params: { id },
			body,
		} = req;
		if (!Object.keys(body).length) return emptyBodyResponse(res);

		for (const key of ['title', 'author', 'genre', 'qty']) {
			if (body[key] !== 'undefined') continue;
			return res.status(400).json({
				error: `Required key '${key}' must be included in request body.`,
			});
		}
		const changes = await model.update(id, body);
		if (!changes) return notFoundID(res, id);

		const updated = await model.get(id);
		if (!updated) {
			return res.status(500).json({
				error: 'An error occured when getting the updated book.',
			});
		}

		res.json(updated);
	},
	patch: async (req, res) => {
		const {
			params: { id },
			body,
		} = req;
		if (!Object.keys(body).length) return emptyBodyResponse(res);

		const changes = await model.update(id, body);
		if (!changes) return notFoundID(res, id);

		const updated = await model.get(id);
		if (!updated) {
			return res.status(500).json({
				error: 'An error occured when getting the updated book.',
			});
		}

		res.json(updated);
	},
};
