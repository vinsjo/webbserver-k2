const db = require('../config/db');

function dbConnection(callback) {
	return async function (...params) {
		try {
			const result = await new Promise((resolve, reject) =>
				callback(resolve, reject, ...params)
			);
			return result;
		} catch (err) {
			console.error(err);
			return null;
		}
	};
}

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
	delete: dbConnection((resolve, reject, id) => {
		db.run('DELETE FROM books WHERE id = ?', id, function (err) {
			err ? reject(err) : resolve(this.changes);
		});
	}),
};
