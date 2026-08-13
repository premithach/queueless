const authService = require('../services/authService');
const { sendJson } = require('../utils/http');

function authenticate(req, res, callback) {
  const authorization = req.headers.authorization;

  if (!authorization) {
    sendJson(res, 401, {
      message: 'Authentication required',
    });
    return;
  }

  const parts = authorization.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    sendJson(res, 401, {
      message: 'Invalid authorization header',
    });
    return;
  }

  const token = parts[1];

  authService.getUserFromToken(token, (error, user) => {
    if (error) {
      sendJson(res, 500, {
        message: 'Failed to authenticate user',
      });
      return;
    }

    if (!user) {
      sendJson(res, 401, {
        message: 'Invalid or expired token',
      });
      return;
    }

    callback(user);
  });
}

function requireRole(user, role, res) {
  if (user.role !== role) {
    sendJson(res, 403, {
      message: `Only ${role.toLowerCase()} users can perform this action`,
    });
    return false;
  }

  return true;
}

module.exports = {
  authenticate,
  requireRole,
};
