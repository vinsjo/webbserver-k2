const db = require('../config/db');
const { createErrorResponse } = require('../utils/errorResponse');

function dbConnection(callback) {
	return async function (...params) {
		try {
			const result = await new Promise((resolve, reject) =>
				callback(resolve, reject, ...params)
			);
			return result;
		} catch (err) {
			if (err.errno === 19) {
				throw createErrorResponse(
					409,
					'A book with that title already exists'
				);
			}
			console.error(err.message);
			throw err;
		}
	};
}

const parseData = (data) => {
	if (!(data instanceof Object)) throw 'Invalid Data';
	const keys = ['title', 'author', 'genre', 'qty'];
	const values = keys.map((key) =>
		data[key] === undefined ? null : data[key]
	);
	return [keys, values];
};

module.exports = {
	all: dbConnection((resolve, reject) =>
		db.all('SELECT * FROM books', (err, rows) =>
			err ? reject(err) : resolve(rows)
		)
	),
	get: dbConnection((resolve, reject, id) =>
		db.get('SELECT * FROM books WHERE id = ?', id, (err, row) =>
			err ? reject(err) : resolve(row)
		)
	),
	getByTitle: dbConnection((resolve, reject, title) =>
		db.get('SELECT * FROM books WHERE title LIKE ?', title, (err, row) =>
			err ? reject(err) : resolve(row)
		)
	),
	insert: dbConnection((resolve, reject, data) => {
		const [keys, values] = parseData(data);
		db.run(
			`INSERT INTO books (${keys.join(', ')}) VALUES (${keys
				.map(() => '?')
				.join(', ')})`,
			values,
			function (err) {
				err ? reject(err) : resolve(this.lastID);
			}
		);
	}),
	delete: dbConnection((resolve, reject, id) => {
		db.run('DELETE FROM books WHERE id = ?', id, function (err) {
			err ? reject(err) : resolve(this.changes);
		});
	}),
	update: dbConnection((resolve, reject, id, data) => {
		const [keys, values] = parseData(data);
		db.run(
			`UPDATE books SET ${keys
				.map((key) => `${key} = ?`)
				.join(', ')} WHERE id = ?`,
			[...values, id],
			function (err) {
				err ? reject(err) : resolve(this.changes);
			}
		);
	}),
};
