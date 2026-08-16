const http = require('http');

require('./db/connection');

const { handleRequest } = require('./routes');

const PORT = 3000;

const server = http.createServer((req, res) => {
  // Allow requests from QueueLess frontend
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');

  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );

  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  );

  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  handleRequest(req, res);
});

server.listen(PORT, () => {
  console.log(`QueueLess server running on http://localhost:${PORT}`);
});
