const authController = require('../controllers/authController');

function handle(req, res) {
  const { method, url } = req;

  if (method === 'POST' && url === '/auth/register') {
    authController.register(req, res);
    return true;
  }

  if (method === 'POST' && url === '/auth/login') {
    authController.login(req, res);
    return true;
  }

  if (method === 'POST' && url === '/auth/register-business') {
    authController.registerBusiness(req, res);
    return true;
  }

  return false;
}

module.exports = {
  handle,
};
