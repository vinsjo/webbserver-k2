const model = require('../models/books.model');
const {
	sendErrorResponse,
	createErrorResponse,
} = require('../utils/errorResponse');

const controllerResponse = (responseCallback) => {
	return async (req, res) => {
		try {
			await responseCallback(req, res);
		} catch (err) {
			sendErrorResponse(res, err);
		}
	};
};

const notFoundID = (id) =>
	createErrorResponse(404, `A book with id '${id}' does not exist.`);

const emptyBodyResponse = () =>
	createErrorResponse(400, "Request body can't be empty");

module.exports = {
	all: controllerResponse(async () => {
		const books = await model.all();
		if (!books) throw createErrorResponse(500, 'An Unknown Error Occurred');
		res.json(books);
	}),
	get: controllerResponse(async (req, res) => {
		const book = await model.get(req.params.id);
		if (!book) throw notFoundID(id);
		res.json(book);
	}),
	delete: controllerResponse(async (req, res) => {
		const changes = await model.delete(req.params.id);
		if (!changes) throw notFoundID(id);
		res.json({ status: 'deleted' });
	}),
	post: controllerResponse(async (req, res) => {
		if (!Object.keys(req.body).length) throw emptyBodyResponse();
		const book = {
			title: null,
			author: null,
			genre: null,
			qty: null,
		};
		for (const key of Object.keys(book)) {
			if (req.body[key] === undefined) {
				throw createErrorResponse(
					400,
					`Required key '${key}' must be included in request body.`
				);
			}
			book[key] = req.body[key];
		}

		if (typeof book.qty !== 'number') book.qty = 1;

		const id = await model.insert(book);

		if (!id) {
			throw createErrorResponse(
				500,
				'An error occured when adding the book.'
			);
		}
		res.status(201).json({ id, ...book });
	}),
	put: controllerResponse(async (req, res) => {
		const {
			params: { id },
			body,
		} = req;
		if (!Object.keys(body).length) throw emptyBodyResponse(res);

		for (const key of ['title', 'author', 'genre', 'qty']) {
			if (body[key] !== 'undefined') continue;
			throw createErrorResponse(
				400,
				`Required key '${key}' must be included in request body.`
			);
		}
		const changes = await model.update(id, body);
		if (!changes) throw notFoundID(res, id);

		const updated = await model.get(id);
		if (!updated) {
			throw createErrorResponse(
				500,
				'An error occured when retrieving the updated book.'
			);
		}
		res.json(updated);
	}),
	patch: controllerResponse(async (req, res) => {
		const {
			params: { id },
			body,
		} = req;

		if (!Object.keys(body).length) throw emptyBodyResponse(res);

		const changes = await model.update(id, body);
		if (!changes) throw notFoundID(res, id);

		const updated = await model.get(id);
		if (!updated) {
			throw createErrorResponse(
				500,
				'An error occured when retrieving the updated book.'
			);
		}
		res.json(updated);
	}),
};
