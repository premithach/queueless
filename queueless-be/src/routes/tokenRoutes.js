const queueTokenController = require('../controllers/queueTokenController');

function handle(req, res) {
  const { method, url } = req;

  // POST /tokens/:id/cancel
  if (
    method === 'POST' &&
    url.startsWith('/tokens/') &&
    url.endsWith('/cancel')
  ) {
    const tokenId = url.split('/')[2];
    queueTokenController.cancelToken(req, res, tokenId);
    return true;
  }

  return false;
}

module.exports = {
  handle,
};
