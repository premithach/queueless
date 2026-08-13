const authRoutes = require('./authRoutes');
const queueRoutes = require('./queueRoutes');
const businessRoutes = require('./businessRoutes');
const serviceRoutes = require('./serviceRoutes');
const tokenRoutes = require('./tokenRoutes');
const userRoutes = require('./userRoutes');
const { sendJson } = require('../utils/http');

function handleRequest(req, res) {
  if (authRoutes.handle(req, res)) {
    return;
  }

  if (queueRoutes.handle(req, res)) {
    return;
  }

  if (businessRoutes.handle(req, res)) {
    return;
  }

  if (serviceRoutes.handle(req, res)) {
    return;
  }

  if (tokenRoutes.handle(req, res)) {
    return;
  }

  if (userRoutes.handle(req, res)) {
    return;
  }

  sendJson(res, 404, {
    message: 'Route not found',
  });
}

module.exports = {
  handleRequest,
};
