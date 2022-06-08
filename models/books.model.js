const db = require('../config/db');

function createCaller(callback) {
	return async function (...params) {
		try {
			const result = await callback(...params);
			return result;
		} catch (err) {
			console.error(err);
			return null;
		}
	};
}

const getAll = createCaller(
	() =>
		new Promise((resolve, reject) =>
			db.all('SELECT * FROM books', (err, rows) =>
				err ? reject(err) : resolve(rows)
			)
		)
);

const getSingle = createCaller(
	(id) =>
		new Promise((resolve, reject) =>
			db.get('SELECT * FROM books WHERE id = ?', id, (err, row) =>
				err ? reject(err) : resolve(row)
			)
		)
);

module.exports = { getAll, getSingle };
