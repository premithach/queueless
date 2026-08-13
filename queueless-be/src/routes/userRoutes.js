const queueTokenController = require('../controllers/queueTokenController');

function handle(req, res) {
  const { method, url } = req;

  // GET /users/me/queue-history
  if (method === 'GET' && url === '/users/me/queue-history') {
    queueTokenController.getUserQueueHistory(req, res);
    return true;
  }

  return false;
}

module.exports = {
  handle,
};
