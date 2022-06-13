const sqlite = require('sqlite3').verbose();

const handleInsertError = (err) => {
	if (err && err.errno !== 19) console.error(err.message);
};

const db = new sqlite.Database('db.sqlite', (err) => {
	if (err) throw err;
	db.run(
		`CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT UNIQUE,
            author TEXT,
            genre TEXT,
			qty INTEGER
        )`,
		(err) => {
			if (err) throw err;
			db.run(
				'INSERT INTO books (title, author, genre, qty) VALUES (?, ?, ?, ?)',
				['Title', 'Author', 'Genre', 3],
				handleInsertError
			);
		}
	);
});

module.exports = db;
