const sqlite = require('sqlite3').verbose();
const md5 = require('md5');

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
	db.run(
		`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        )`,
		(err) => {
			if (err) throw err;
			db.run(
				'INSERT INTO users (username, password) VALUES (?, ?)',
				['username', md5('password')],
				handleInsertError
			);
		}
	);
	db.run(
		`CREATE TABLE IF NOT EXISTS loans (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            book_id INTEGER,
            user_id INTEGER,
			timestamp INTEGER NOT NULL DEFAULT (unixepoch()),
			CONSTRAINT fk_book_id
				FOREIGN KEY(book_id) 
				REFERENCES books(id)
				ON DELETE CASCADE,
			CONSTRAINT fk_user_id
				FOREIGN KEY(user_id)
				REFERENCES users(id)
				ON DELETE CASCADE
        )`,
		(err) => {
			if (err) throw err;
			db.run(
				'INSERT INTO loans (book_id, user_id) VALUES (?,?)',
				[1, 1],
				handleInsertError
			);
		}
	);
});

module.exports = db;
