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
	update: dbConnection((resolve, reject, id, data) => {
		if (!(data instanceof Object)) throw 'Invalid Data';
		const values = ['title', 'author', 'genre', 'qty']
			.map((key) => (!data[key] ? null : { key, value: data[key] }))
			.filter((entry) => !!entry);
		if (!values.length) throw 'No Updated Data';
		db.run(
			`UPDATE books SET ${values
				.map(({ key }) => `${key} = ?`)
				.join(', ')} WHERE id = ?`,
			[...values.map(({ value }) => value), id],
			function (err) {
				err ? reject(err) : resolve(this.changes);
			}
		);
	}),
};
