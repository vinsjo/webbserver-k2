const express = require('express');
const routers = require('./routers');

const app = express();

app.use(express.json())
	.use('/books', routers.books)
	.all('*', (req, res) =>
		res.status(404).json({ error: `Route '${req.url}' does not exist` })
	)
	.listen(4000, () => console.log('Listening on port 4000'));
