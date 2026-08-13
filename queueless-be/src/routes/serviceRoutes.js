const serviceController = require('../controllers/serviceController');
const queueController = require('../controllers/queueController');

function handle(req, res) {
  const { method, url } = req;

  // GET /services/:id/queue
  if (
    method === 'GET' &&
    url.startsWith('/services/') &&
    url.endsWith('/queue')
  ) {
    const serviceId = url.split('/')[2];
    queueController.getByServiceId(req, res, serviceId);
    return true;
  }

  // PATCH /services/:id
  if (method === 'PATCH' && url.startsWith('/services/')) {
    const serviceId = url.split('/')[2];
    serviceController.update(req, res, serviceId);
    return true;
  }

  // DELETE /services/:id
  if (method === 'DELETE' && url.startsWith('/services/')) {
    const serviceId = url.split('/')[2];
    serviceController.remove(req, res, serviceId);
    return true;
  }

  // POST /services/:id/queue
  if (
    method === 'POST' &&
    url.startsWith('/services/') &&
    url.endsWith('/queue')
  ) {
    const serviceId = url.split('/')[2];
    queueController.create(req, res, serviceId);
    return true;
  }

  return false;
}

module.exports = {
  handle,
};
