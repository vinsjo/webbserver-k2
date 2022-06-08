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

const getAll = dbConnection((resolve, reject) =>
	db.all('SELECT * FROM books', (err, rows) =>
		err ? reject(err) : resolve(rows)
	)
);

const getSingle = dbConnection((resolve, reject, id) =>
	db.get('SELECT * FROM books WHERE id = ?', id, (err, row) =>
		err ? reject(err) : resolve(row)
	)
);

const deleteBook = dbConnection((resolve, reject, id) => {
	db.run('DELETE FROM books WHERE id = ?', id, function (err) {
		err ? reject(err) : resolve(this.changes);
	});
});

module.exports = { all: getAll, get: getSingle, delete: deleteBook };
