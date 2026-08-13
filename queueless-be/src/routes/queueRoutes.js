const queueController = require('../controllers/queueController');
const queueTokenController = require('../controllers/queueTokenController');

function handle(req, res) {
  const { method, url } = req;

  // GET /queues/:queueId/tokens/:tokenId/status
  if (
    method === 'GET' &&
    url.startsWith('/queues/') &&
    url.endsWith('/status')
  ) {
    const parts = url.split('/');
    const queueId = parts[2];
    const tokenId = parts[4];
    queueTokenController.getStatus(req, res, queueId, tokenId);
    return true;
  }

  // POST /queues/:id/join
  if (
    method === 'POST' &&
    url.startsWith('/queues/') &&
    url.endsWith('/join')
  ) {
    const queueId = url.split('/')[2];
    queueTokenController.join(req, res, queueId);
    return true;
  }

  // POST /queues/:id/next
  if (
    method === 'POST' &&
    url.startsWith('/queues/') &&
    url.endsWith('/next')
  ) {
    const queueId = url.split('/')[2];
    queueController.callNext(req, res, queueId);
    return true;
  }

  // POST /queues/:id/complete
  if (
    method === 'POST' &&
    url.startsWith('/queues/') &&
    url.endsWith('/complete')
  ) {
    const queueId = url.split('/')[2];
    queueController.complete(req, res, queueId);
    return true;
  }

  // PATCH /queues/:id
  if (method === 'PATCH' && url.startsWith('/queues/')) {
    const queueId = url.split('/')[2];
    queueController.updateStatus(req, res, queueId);
    return true;
  }

  // GET /queues/:id/tokens
  if (
    method === 'GET' &&
    url.startsWith('/queues/') &&
    url.endsWith('/tokens')
  ) {
    const queueId = url.split('/')[2];
    queueTokenController.getQueueTokens(req, res, queueId);
    return true;
  }

  // POST /queues/:id/skip
  if (
    method === 'POST' &&
    url.startsWith('/queues/') &&
    url.endsWith('/skip')
  ) {
    const queueId = url.split('/')[2];
    queueController.skip(req, res, queueId);
    return true;
  }

  // POST /queues/:id/cancel
  if (
    method === 'POST' &&
    url.startsWith('/queues/') &&
    url.endsWith('/cancel')
  ) {
    const queueId = url.split('/')[2];
    queueController.cancel(req, res, queueId);
    return true;
  }

  // GET /queues/:id/history
  if (
    method === 'GET' &&
    url.startsWith('/queues/') &&
    url.endsWith('/history')
  ) {
    const queueId = url.split('/')[2];
    queueTokenController.getBusinessQueueHistory(req, res, queueId);
    return true;
  }

  // GET /queues/:id/statistics
  if (
    method === 'GET' &&
    url.startsWith('/queues/') &&
    url.endsWith('/statistics')
  ) {
    const queueId = url.split('/')[2];
    queueTokenController.getQueueStatistics(req, res, queueId);
    return true;
  }

  return false;
}

module.exports = {
  handle,
};
