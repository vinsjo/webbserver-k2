const sqlite = require('sqlite3').verbose();

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
			db.run(
				'INSERT INTO books (title, author, genre) VALUES (?,?,?)',
				['ABC', '123', 'books'],
				(err) => console.error(err)
			);
		}
	);
});

module.exports = db;
