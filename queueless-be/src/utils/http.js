function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
  });

  res.end(JSON.stringify(data));
}

function parseJsonBody(req, callback) {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', () => {
    try {
      callback(null, JSON.parse(body));
    } catch (error) {
      callback(error, null);
    }
  });
}

module.exports = {
  sendJson,
  parseJsonBody,
};
