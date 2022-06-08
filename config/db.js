const sqlite = require('sqlite3').verbose();

const defaultBooks = [
	{ title: 'ABC', author: '123', genre: 'book' },
	{ title: 'DEF', author: '123', genre: 'book' },
	{ title: 'GHI', author: '123', genre: 'book' },
	{ title: 'JKL', author: '123', genre: 'book' },
];

const db = new sqlite.Database('./db.sqlite', (err) => {
	if (err) {
		console.error(err);
		throw err;
	}
	db.run(
		`CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT UNIQUE,
            author TEXT,
            genre TEXT
        )`,
		(err) => {
			if (err) throw err;
			defaultBooks.forEach(({ title, author, genre }) => {
				db.run(
					'INSERT INTO books (title, author, genre) VALUES (?, ?, ?)',
					[title, author, genre],
					(err) => err && console.error(err)
				);
			});
		}
	);
});

module.exports = db;
