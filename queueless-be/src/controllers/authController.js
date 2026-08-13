const authService = require('../services/authService');
const { sendJson, parseJsonBody } = require('../utils/http');

function register(req, res) {
  parseJsonBody(req, (error, data) => {
    if (error) {
      sendJson(res, 400, {
        message: 'Invalid JSON',
      });
      return;
    }

    const { name, email, password, role } = data;

    if (!name || !email || !password || !role) {
      sendJson(res, 400, {
        message: 'Name, email, password and role are required',
      });
      return;
    }

    if (!['CUSTOMER', 'BUSINESS'].includes(role)) {
      sendJson(res, 400, {
        message: 'Invalid role',
      });
      return;
    }

    authService.registerUser(name, email, password, role, (error, user) => {
      if (error) {
        sendJson(res, 500, {
          message: 'Failed to register user',
        });
        return;
      }

      if (user.error === 'EMAIL_EXISTS') {
        sendJson(res, 409, {
          message: 'Email already exists',
        });
        return;
      }

      sendJson(res, 201, user);
    });
  });
}

function login(req, res) {
  parseJsonBody(req, (error, data) => {
    if (error) {
      sendJson(res, 400, {
        message: 'Invalid JSON',
      });
      return;
    }

    const { email, password } = data;

    if (!email || !password) {
      sendJson(res, 400, {
        message: 'Email and password are required',
      });
      return;
    }

    authService.loginUser(email, password, (error, user) => {
      if (error) {
        sendJson(res, 500, {
          message: 'Failed to login',
        });
        return;
      }

      if (user.error === 'INVALID_CREDENTIALS') {
        sendJson(res, 401, {
          message: 'Invalid email or password',
        });
        return;
      }

      sendJson(res, 200, user);
    });
  });
}

function registerBusiness(req, res) {
  parseJsonBody(req, (error, data) => {
    if (error) {
      sendJson(res, 400, {
        message: 'Invalid JSON',
      });
      return;
    }

    const {
      userName,
      email,
      password,
      businessName,
      category,
      address,
      latitude,
      longitude,
    } = data;

    if (
      !userName ||
      !email ||
      !password ||
      !businessName ||
      !category ||
      !address
    ) {
      sendJson(res, 400, {
        message:
          'userName, email, password, businessName, category and address are required',
      });
      return;
    }

    authService.registerBusiness(
      userName,
      email,
      password,
      businessName,
      category,
      address,
      latitude,
      longitude,
      (error, result) => {
        if (error) {
          sendJson(res, 500, {
            message: 'Failed to register business',
          });
          return;
        }

        if (result.error === 'EMAIL_EXISTS') {
          sendJson(res, 409, {
            message: 'Email already exists',
          });
          return;
        }

        sendJson(res, 201, result);
      }
    );
  });
}

module.exports = {
  register,
  login,
  registerBusiness,
};
