const queueService = require('../services/queueService');
const { authenticate, requireRole } = require('../middleware/authMiddleware');
const { sendJson, parseJsonBody } = require('../utils/http');

function getByServiceId(req, res, serviceId) {
  queueService.getQueueByServiceId(serviceId, (error, queue) => {
    if (error) {
      sendJson(res, 500, {
        message: 'Failed to fetch queue',
      });
      return;
    }

    if (!queue) {
      sendJson(res, 404, {
        message: 'Queue not found',
      });
      return;
    }

    sendJson(res, 200, queue);
  });
}

function create(req, res, serviceId) {
  authenticate(req, res, (user) => {
    if (!requireRole(user, 'BUSINESS', res)) {
      return;
    }

    queueService.createQueue(serviceId, user.business_id, (error, queue) => {
      if (error) {
        sendJson(res, 500, {
          message: 'Failed to create queue',
        });
        return;
      }

      if (queue.error === 'SERVICE_NOT_FOUND') {
        sendJson(res, 404, {
          message: 'Service not found for this business',
        });
        return;
      }

      if (queue.error === 'QUEUE_ALREADY_EXISTS') {
        sendJson(res, 409, {
          message: 'Queue already exists for this service',
        });
        return;
      }

      sendJson(res, 201, queue);
    });
  });
}

function updateStatus(req, res, queueId) {
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

      const { status } = data;

      if (!status) {
        sendJson(res, 400, {
          message: 'Status is required',
        });
        return;
      }

      queueService.updateQueueStatus(
        queueId,
        user.business_id,
        status,
        (error, queue) => {
          if (error) {
            sendJson(res, 500, {
              message: 'Failed to update queue',
            });
            return;
          }

          if (queue.error === 'INVALID_STATUS') {
            sendJson(res, 400, {
              message: 'Invalid status. Use OPEN, PAUSED or CLOSED',
            });
            return;
          }

          if (queue.error === 'QUEUE_NOT_FOUND') {
            sendJson(res, 404, {
              message: 'Queue not found',
            });
            return;
          }

          if (queue.error === 'ALREADY_IN_STATUS') {
            sendJson(res, 400, {
              message: `Queue is already ${queue.status}`,
            });
            return;
          }

          sendJson(res, 200, queue);
        }
      );
    });
  });
}

function callNext(req, res, queueId) {
  authenticate(req, res, (user) => {
    if (!requireRole(user, 'BUSINESS', res)) {
      return;
    }

    queueService.callNextCustomer(
      queueId,
      user.business_id,
      (error, result) => {
        if (error) {
          sendJson(res, 500, {
            message: 'Failed to call next customer',
          });
          return;
        }

        if (result.error === 'QUEUE_NOT_FOUND') {
          sendJson(res, 404, {
            message: 'Queue not found',
          });
          return;
        }

        if (result.error === 'QUEUE_NOT_OPEN') {
          sendJson(res, 400, {
            message: 'Queue is not open',
          });
          return;
        }

        if (result.error === 'CUSTOMER_ALREADY_SERVING') {
          sendJson(res, 409, {
            message: 'A customer is already being served',
            token: result.token,
          });
          return;
        }

        if (result.error === 'NO_WAITING_CUSTOMERS') {
          sendJson(res, 404, {
            message: 'No waiting customers',
          });
          return;
        }

        sendJson(res, 200, result);
      }
    );
  });
}

function complete(req, res, queueId) {
  authenticate(req, res, (user) => {
    if (!requireRole(user, 'BUSINESS', res)) {
      return;
    }

    queueService.completeCurrentCustomer(
      queueId,
      user.business_id,
      (error, result) => {
        if (error) {
          sendJson(res, 500, {
            message: 'Failed to complete customer',
          });
          return;
        }

        if (result.error === 'QUEUE_NOT_FOUND') {
          sendJson(res, 404, {
            message: 'Queue not found',
          });
          return;
        }

        if (result.error === 'NO_CURRENT_CUSTOMER') {
          sendJson(res, 400, {
            message: 'No customer is currently being served',
          });
          return;
        }

        if (result.error === 'CURRENT_CUSTOMER_NOT_FOUND') {
          sendJson(res, 404, {
            message: 'Current customer not found',
          });
          return;
        }

        sendJson(res, 200, result);
      }
    );
  });
}

function skip(req, res, queueId) {
  authenticate(req, res, (user) => {
    if (!requireRole(user, 'BUSINESS', res)) {
      return;
    }

    queueService.skipCurrentCustomer(
      queueId,
      user.business_id,
      (error, result) => {
        if (error) {
          sendJson(res, 500, {
            message: 'Failed to skip customer',
          });
          return;
        }

        if (result.error === 'QUEUE_NOT_FOUND') {
          sendJson(res, 404, {
            message: 'Queue not found',
          });
          return;
        }

        if (result.error === 'NO_CURRENT_CUSTOMER') {
          sendJson(res, 400, {
            message: 'No customer is currently being served',
          });
          return;
        }

        if (result.error === 'CURRENT_CUSTOMER_NOT_FOUND') {
          sendJson(res, 404, {
            message: 'Current customer not found',
          });
          return;
        }

        sendJson(res, 200, result);
      }
    );
  });
}

function cancel(req, res, queueId) {
  authenticate(req, res, (user) => {
    if (!requireRole(user, 'BUSINESS', res)) {
      return;
    }

    queueService.cancelCurrentCustomer(
      queueId,
      user.business_id,
      (error, result) => {
        if (error) {
          sendJson(res, 500, {
            message: 'Failed to cancel customer',
          });
          return;
        }

        if (result.error === 'QUEUE_NOT_FOUND') {
          sendJson(res, 404, {
            message: 'Queue not found',
          });
          return;
        }

        if (result.error === 'NO_CURRENT_CUSTOMER') {
          sendJson(res, 400, {
            message: 'No customer is currently being served',
          });
          return;
        }

        if (result.error === 'CURRENT_CUSTOMER_NOT_FOUND') {
          sendJson(res, 404, {
            message: 'Current customer not found',
          });
          return;
        }

        sendJson(res, 200, result);
      }
    );
  });
}

module.exports = {
  getByServiceId,
  create,
  updateStatus,
  callNext,
  complete,
  skip,
  cancel,
};
