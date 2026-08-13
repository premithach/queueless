const businessController = require('../controllers/businessController');
const serviceController = require('../controllers/serviceController');

function handle(req, res) {
  const { method, url } = req;

  // GET /businesses/nearby
  if (method === 'GET' && url.startsWith('/businesses/nearby')) {
    businessController.getNearby(req, res);
    return true;
  }

  // GET /businesses/:id/services
  if (
    method === 'GET' &&
    url.startsWith('/businesses/') &&
    url.endsWith('/services')
  ) {
    const businessId = url.split('/')[2];
    serviceController.getByBusinessId(req, res, businessId);
    return true;
  }

  // GET /businesses/search?search_term=hospital
  if (method === 'GET' && url.startsWith('/businesses/search')) {
    businessController.search(req, res);
    return true;
  }

  // GET /businesses/:id
  if (method === 'GET' && url.startsWith('/businesses/')) {
    const businessId = url.split('/')[2];
    businessController.getById(req, res, businessId);
    return true;
  }

  // GET /businesses
  // GET /businesses?category=Hospital
  if (
    method === 'GET' &&
    (url === '/businesses' || url.startsWith('/businesses?'))
  ) {
    businessController.getAll(req, res);
    return true;
  }

  // POST /businesses/:id/services
  if (
    method === 'POST' &&
    url.startsWith('/businesses/') &&
    url.endsWith('/services')
  ) {
    const businessId = url.split('/')[2];
    serviceController.create(req, res, businessId);
    return true;
  }

  return false;
}

module.exports = {
  handle,
};
