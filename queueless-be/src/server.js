const http = require('http');

require('./db/connection');

const { handleRequest } = require('./routes');

const PORT = 3000;

const server = http.createServer((req, res) => {
  handleRequest(req, res);
});

server.listen(PORT, () => {
  console.log(`QueueLess server running on http://localhost:${PORT}`);
});
