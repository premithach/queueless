const serviceService = require('../services/serviceService');
const { authenticate, requireRole } = require('../middleware/authMiddleware');
const { sendJson, parseJsonBody } = require('../utils/http');

function getByBusinessId(req, res, businessId) {
  serviceService.getServicesByBusinessId(businessId, (error, services) => {
    if (error) {
      sendJson(res, 500, {
        message: 'Failed to fetch services',
      });
      return;
    }

    sendJson(res, 200, services);
  });
}

function create(req, res, businessId) {
  authenticate(req, res, (user) => {
    if (!requireRole(user, 'BUSINESS', res)) {
      return;
    }

    if (Number(businessId) !== user.business_id) {
      sendJson(res, 403, {
        message: 'You cannot manage another business',
      });
      return;
    }

    parseJsonBody(req, (error, data) => {
      if (error) {
        sendJson(res, 400, {
          message: 'Invalid JSON',
        });
        return;
      }

      const { name, description, average_service_time } = data;

      if (!name || !average_service_time) {
        sendJson(res, 400, {
          message: 'name and average_service_time are required',
        });
        return;
      }

      serviceService.createService(
        businessId,
        name,
        description,
        average_service_time,
        (error, service) => {
          if (error) {
            sendJson(res, 500, {
              message: 'Failed to create service',
            });
            return;
          }

          sendJson(res, 201, service);
        }
      );
    });
  });
}

function update(req, res, serviceId) {
  authenticate(req, res, (user) => {
    if (!requireRole(user, 'BUSINESS', res)) {
      return;
    }

    parseJsonBody(req, (error, data) => {
      if (error) {
        sendJson(res, 400, {
          message: 'Invalid JSON',
        });
        return;
      }

      const { name, description, average_service_time } = data;

      if (!name || !average_service_time) {
        sendJson(res, 400, {
          message: 'name and average_service_time are required',
        });
        return;
      }

      serviceService.updateService(
        serviceId,
        user.business_id,
        name,
        description,
        average_service_time,
        (error, service) => {
          if (error) {
            sendJson(res, 500, {
              message: 'Failed to update service',
            });
            return;
          }

          if (service.error === 'SERVICE_NOT_FOUND') {
            sendJson(res, 404, {
              message: 'Service not found',
            });
            return;
          }

          sendJson(res, 200, service);
        }
      );
    });
  });
}

function remove(req, res, serviceId) {
  authenticate(req, res, (user) => {
    if (!requireRole(user, 'BUSINESS', res)) {
      return;
    }

    serviceService.deleteService(
      serviceId,
      user.business_id,
      (error, result) => {
        if (error) {
          sendJson(res, 500, {
            message: 'Failed to delete service',
          });
          return;
        }

        if (result.error === 'SERVICE_NOT_FOUND') {
          sendJson(res, 404, {
            message: 'Service not found',
          });
          return;
        }

        if (result.error === 'SERVICE_HAS_QUEUE') {
          sendJson(res, 409, {
            message: 'Cannot delete service because it has a queue',
          });
          return;
        }

        sendJson(res, 200, result);
      }
    );
  });
}

module.exports = {
  getByBusinessId,
  create,
  update,
  remove,
};
