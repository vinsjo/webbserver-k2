const express = require('express');
const routers = require('./routers');

const PORT = (() => {
	const port = parseInt(process.argv[2]);
	return !port || Number.isNaN(port) || port <= 1024 || port >= 10000
		? 5000
		: port;
})();

express()
	.use(express.json())
	.use('/books', routers.books)
	.all('*', (req, res) =>
		res.status(404).json({ error: `Route '${req.url}' does not exist` })
	)
	.listen(PORT, () => console.log(`Listening on port ${PORT}`));
