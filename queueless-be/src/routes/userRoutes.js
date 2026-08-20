const queueTokenController = require('../controllers/queueTokenController');

function handle(req, res) {
  const { method, url } = req;

  // GET /users/me/queue-history
  if (
    method === 'GET' &&
    url === '/users/me/queue-history'
  ) {
    queueTokenController.getUserQueueHistory(req, res);
    return true;
  }

  // GET /users/me/active-queues
  if (
    method === 'GET' &&
    url === '/users/me/active-queues'
  ) {
    queueTokenController.getActiveQueueTokens(req, res);
    return true;
  }

  return false;
}

module.exports = {
  handle,
};
