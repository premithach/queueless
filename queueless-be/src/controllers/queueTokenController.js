const queueTokenService = require('../services/queueTokenService');
const { authenticate, requireRole } = require('../middleware/authMiddleware');
const { sendJson } = require('../utils/http');

function getStatus(req, res, queueId, tokenId) {
  queueTokenService.getTokenById(tokenId, (error, token) => {
    if (error) {
      sendJson(res, 500, {
        message: 'Failed to fetch token',
      });
      return;
    }

    if (!token) {
      sendJson(res, 404, {
        message: 'Token not found',
      });
      return;
    }

    queueTokenService.getEstimatedWait(
      queueId,
      token.token_number,
      (error, waitData) => {
        if (error) {
          sendJson(res, 500, {
            message: 'Failed to calculate waiting time',
          });
          return;
        }

        sendJson(res, 200, {
          token_number: token.token_number,
          status: token.status,
          business_name: token.business_name,
          service_name: token.service_name,
          people_ahead: waitData.peopleAhead,
          average_service_time: waitData.averageServiceTime,
          estimated_wait_minutes: waitData.estimatedWaitMinutes,
        });
      }
    );
  });
}

function join(req, res, queueId) {
  authenticate(req, res, (user) => {
    if (!requireRole(user, 'CUSTOMER', res)) {
      return;
    }

    queueTokenService.joinQueue(
      queueId,
      user.id,
      (error, queueToken) => {
        if (error) {
          sendJson(res, 500, {
            message: 'Failed to join queue',
          });
          return;
        }

        if (queueToken.error === 'QUEUE_NOT_FOUND') {
          sendJson(res, 404, {
            message: 'Queue not found',
          });
          return;
        }

        if (queueToken.error === 'QUEUE_NOT_OPEN') {
          sendJson(res, 400, {
            message: 'Queue is not open',
          });
          return;
        }

        if (queueToken.error === 'ALREADY_JOINED') {
          sendJson(res, 200, {
            status: 'ALREADY_JOINED',
            message: 'Customer has already joined this service',
            token: queueToken.token,
          });
          return;
        }

        sendJson(res, 200, {
          status: 'JOINED',
          token: queueToken,
        });
      }
    );
  });
}

function cancelToken(req, res, tokenId) {
  authenticate(req, res, (user) => {
    if (!requireRole(user, 'CUSTOMER', res)) {
      return;
    }

    queueTokenService.cancelToken(tokenId, user.id, (error, result) => {
      if (error) {
        sendJson(res, 500, {
          message: 'Failed to cancel token',
        });
        return;
      }

      if (result.error === 'TOKEN_NOT_FOUND') {
        sendJson(res, 404, {
          message: 'Token not found',
        });
        return;
      }

      if (result.error === 'NOT_TOKEN_OWNER') {
        sendJson(res, 403, {
          message: "You cannot cancel another customer's token",
        });
        return;
      }

      if (result.error === 'TOKEN_CANNOT_BE_CANCELLED') {
        sendJson(res, 400, {
          message: 'Token cannot be cancelled',
          status: result.status,
        });
        return;
      }

      sendJson(res, 200, result);
    });
  });
}

function getQueueTokens(req, res, queueId) {
  authenticate(req, res, (user) => {
    if (!requireRole(user, 'BUSINESS', res)) {
      return;
    }

    queueTokenService.getQueueTokens(
      queueId,
      user.business_id,
      (error, tokens) => {
        if (error) {
          sendJson(res, 500, {
            message: 'Failed to fetch queue customers',
          });
          return;
        }

        sendJson(res, 200, tokens);
      }
    );
  });
}

function getBusinessQueueHistory(req, res, queueId) {
  authenticate(req, res, (user) => {
    if (!requireRole(user, 'BUSINESS', res)) {
      return;
    }

    queueTokenService.getBusinessQueueHistory(
      queueId,
      user.business_id,
      (error, history) => {
        if (error) {
          sendJson(res, 500, {
            message: 'Failed to fetch queue history',
          });
          return;
        }

        sendJson(res, 200, history);
      }
    );
  });
}

function getQueueStatistics(req, res, queueId) {
  authenticate(req, res, (user) => {
    if (!requireRole(user, 'BUSINESS', res)) {
      return;
    }

    queueTokenService.getQueueStatistics(
      queueId,
      user.business_id,
      (error, statistics) => {
        if (error) {
          sendJson(res, 500, {
            message: 'Failed to fetch queue statistics',
          });
          return;
        }

        sendJson(res, 200, statistics);
      }
    );
  });
}

function getUserQueueHistory(req, res) {
  authenticate(req, res, (user) => {
    if (!requireRole(user, 'CUSTOMER', res)) {
      return;
    }

    queueTokenService.getQueueHistory(user.id, (error, history) => {
      if (error) {
        sendJson(res, 500, {
          message: 'Failed to fetch queue history',
        });
        return;
      }

      sendJson(res, 200, history);
    });
  });
}

function getActiveQueueTokens(req, res) {
  authenticate(req, res, (user) => {
    if (!requireRole(user, 'CUSTOMER', res)) {
      return;
    }

    queueTokenService.getActiveQueueTokens(
      user.id,
      (error, tokens) => {
        if (error) {
          sendJson(res, 500, {
            message: 'Failed to fetch active queues',
          });
          return;
        }

        sendJson(res, 200, tokens);
      }
    );
  });
}

module.exports = {
  getStatus,
  join,
  cancelToken,
  getQueueTokens,
  getBusinessQueueHistory,
  getQueueStatistics,
  getUserQueueHistory,
  getActiveQueueTokens,
};
