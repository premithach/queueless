const db = require('../db/connection');

function getQueueByServiceId(serviceId, callback) {
  const query = `
    SELECT *
    FROM queues
    WHERE service_id = ?
  `;

  db.query(query, [serviceId], (error, results) => {
    if (error) {
      callback(error, null);
      return;
    }

    callback(null, results[0]);
  });
}

function callNextCustomer(queueId, businessId, callback) {
  const queueQuery = `
      SELECT id, business_id, service_id, status, current_token
      FROM queues
      WHERE id = ?
      AND business_id = ?
    `;

  db.query(queueQuery, [queueId, businessId], (error, queues) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (queues.length === 0) {
      callback(null, {
        error: 'QUEUE_NOT_FOUND',
      });
      return;
    }

    const queue = queues[0];

    if (queue.status !== 'OPEN') {
      callback(null, {
        error: 'QUEUE_NOT_OPEN',
      });
      return;
    }

    // Make sure there isn't already a customer being served
    const servingQuery = `
        SELECT *
        FROM queue_tokens
        WHERE queue_id = ?
        AND status = 'SERVING'
        LIMIT 1
      `;

    db.query(servingQuery, [queueId], (error, servingTokens) => {
      if (error) {
        callback(error, null);
        return;
      }

      if (servingTokens.length > 0) {
        callback(null, {
          error: 'CUSTOMER_ALREADY_SERVING',
          token: servingTokens[0],
        });
        return;
      }

      // Find the first waiting customer
      const waitingQuery = `
            SELECT *
            FROM queue_tokens
            WHERE queue_id = ?
            AND status = 'WAITING'
            ORDER BY token_number ASC
            LIMIT 1
          `;

      db.query(waitingQuery, [queueId], (error, waitingTokens) => {
        if (error) {
          callback(error, null);
          return;
        }

        if (waitingTokens.length === 0) {
          callback(null, {
            error: 'NO_WAITING_CUSTOMERS',
          });
          return;
        }

        const token = waitingTokens[0];

        const updateTokenQuery = `
                UPDATE queue_tokens
                SET
                  status = 'SERVING',
                  called_at = CURRENT_TIMESTAMP
                WHERE id = ?
              `;

        db.query(updateTokenQuery, [token.id], (error) => {
          if (error) {
            callback(error, null);
            return;
          }

          const updateQueueQuery = `
                    UPDATE queues
                    SET current_token = ?
                    WHERE id = ?
                    AND business_id = ?
                  `;

          db.query(
            updateQueueQuery,
            [token.token_number, queueId, businessId],
            (error) => {
              if (error) {
                callback(error, null);
                return;
              }

              callback(null, {
                id: token.id,
                queue_id: queueId,
                user_id: token.user_id,
                token_number: token.token_number,
                status: 'SERVING',
              });
            }
          );
        });
      });
    });
  });
}

function completeCurrentCustomer(queueId, businessId, callback) {
  const queueQuery = `
      SELECT id, business_id, current_token
      FROM queues
      WHERE id = ?
      AND business_id = ?
    `;

  db.query(queueQuery, [queueId, businessId], (error, queues) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (queues.length === 0) {
      callback(null, {
        error: 'QUEUE_NOT_FOUND',
      });
      return;
    }

    const queue = queues[0];

    if (!queue.current_token) {
      callback(null, {
        error: 'NO_CURRENT_CUSTOMER',
      });
      return;
    }

    const updateTokenQuery = `
        UPDATE queue_tokens
        SET
          status = 'COMPLETED',
          completed_at = CURRENT_TIMESTAMP
        WHERE queue_id = ?
        AND token_number = ?
        AND status = 'SERVING'
      `;

    db.query(
      updateTokenQuery,
      [queueId, queue.current_token],
      (error, result) => {
        if (error) {
          callback(error, null);
          return;
        }

        if (result.affectedRows === 0) {
          callback(null, {
            error: 'CURRENT_CUSTOMER_NOT_FOUND',
          });
          return;
        }

        const updateQueueQuery = `
            UPDATE queues
            SET current_token = NULL
            WHERE id = ?
            AND business_id = ?
          `;

        db.query(updateQueueQuery, [queueId, businessId], (error) => {
          if (error) {
            callback(error, null);
            return;
          }

          callback(null, {
            queue_id: queueId,
            completed_token: queue.current_token,
            status: 'COMPLETED',
          });
        });
      }
    );
  });
}

function createQueue(serviceId, businessId, callback) {
  // Make sure the service belongs to this business
  const checkServiceQuery = `
      SELECT id
      FROM services
      WHERE id = ?
      AND business_id = ?
    `;

  db.query(checkServiceQuery, [serviceId, businessId], (error, services) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (services.length === 0) {
      callback(null, {
        error: 'SERVICE_NOT_FOUND',
      });
      return;
    }

    // Make sure this service doesn't already have a queue
    const checkQueueQuery = `
          SELECT id
          FROM queues
          WHERE service_id = ?
        `;

    db.query(checkQueueQuery, [serviceId], (error, queues) => {
      if (error) {
        callback(error, null);
        return;
      }

      if (queues.length > 0) {
        callback(null, {
          error: 'QUEUE_ALREADY_EXISTS',
        });
        return;
      }

      const createQueueQuery = `
              INSERT INTO queues
              (business_id, service_id, status)
              VALUES (?, ?, 'CLOSED')
            `;

      db.query(createQueueQuery, [businessId, serviceId], (error, result) => {
        if (error) {
          callback(error, null);
          return;
        }

        callback(null, {
          id: result.insertId,
          business_id: Number(businessId),
          service_id: Number(serviceId),
          status: 'CLOSED',
          current_token: null,
        });
      });
    });
  });
}

function updateQueueStatus(queueId, businessId, status, callback) {
  const validStatuses = ['OPEN', 'PAUSED', 'CLOSED'];

  if (!validStatuses.includes(status)) {
    callback(null, {
      error: 'INVALID_STATUS',
    });
    return;
  }

  const findQueueQuery = `
      SELECT id, business_id, service_id, status, current_token
      FROM queues
      WHERE id = ?
      AND business_id = ?
    `;

  db.query(findQueueQuery, [queueId, businessId], (error, queues) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (queues.length === 0) {
      callback(null, {
        error: 'QUEUE_NOT_FOUND',
      });
      return;
    }

    const queue = queues[0];

    // Don't allow changing to the same status
    if (queue.status === status) {
      callback(null, {
        error: 'ALREADY_IN_STATUS',
        status,
      });
      return;
    }

    const updateQuery = `
          UPDATE queues
          SET status = ?
          WHERE id = ?
          AND business_id = ?
        `;

    db.query(updateQuery, [status, queueId, businessId], (error) => {
      if (error) {
        callback(error, null);
        return;
      }

      callback(null, {
        id: queue.id,
        business_id: queue.business_id,
        service_id: queue.service_id,
        status,
        current_token: queue.current_token,
      });
    });
  });
}

function skipCurrentCustomer(queueId, businessId, callback) {
  const queueQuery = `
      SELECT id, business_id, current_token
      FROM queues
      WHERE id = ?
      AND business_id = ?
    `;

  db.query(queueQuery, [queueId, businessId], (error, queues) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (queues.length === 0) {
      callback(null, {
        error: 'QUEUE_NOT_FOUND',
      });
      return;
    }

    const queue = queues[0];

    if (!queue.current_token) {
      callback(null, {
        error: 'NO_CURRENT_CUSTOMER',
      });
      return;
    }

    const updateTokenQuery = `
        UPDATE queue_tokens
        SET
          status = 'SKIPPED'
        WHERE queue_id = ?
        AND token_number = ?
        AND status = 'SERVING'
      `;

    db.query(
      updateTokenQuery,
      [queueId, queue.current_token],
      (error, result) => {
        if (error) {
          callback(error, null);
          return;
        }

        if (result.affectedRows === 0) {
          callback(null, {
            error: 'CURRENT_CUSTOMER_NOT_FOUND',
          });
          return;
        }

        const updateQueueQuery = `
            UPDATE queues
            SET current_token = NULL
            WHERE id = ?
            AND business_id = ?
          `;

        db.query(updateQueueQuery, [queueId, businessId], (error) => {
          if (error) {
            callback(error, null);
            return;
          }

          callback(null, {
            queue_id: queueId,
            skipped_token: queue.current_token,
            status: 'SKIPPED',
          });
        });
      }
    );
  });
}

function cancelCurrentCustomer(queueId, businessId, callback) {
  const queueQuery = `
      SELECT id, business_id, current_token
      FROM queues
      WHERE id = ?
      AND business_id = ?
    `;

  db.query(queueQuery, [queueId, businessId], (error, queues) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (queues.length === 0) {
      callback(null, {
        error: 'QUEUE_NOT_FOUND',
      });
      return;
    }

    const queue = queues[0];

    if (!queue.current_token) {
      callback(null, {
        error: 'NO_CURRENT_CUSTOMER',
      });
      return;
    }

    const updateTokenQuery = `
        UPDATE queue_tokens
        SET status = 'CANCELLED'
        WHERE queue_id = ?
        AND token_number = ?
        AND status = 'SERVING'
      `;

    db.query(
      updateTokenQuery,
      [queueId, queue.current_token],
      (error, result) => {
        if (error) {
          callback(error, null);
          return;
        }

        if (result.affectedRows === 0) {
          callback(null, {
            error: 'CURRENT_CUSTOMER_NOT_FOUND',
          });
          return;
        }

        const updateQueueQuery = `
            UPDATE queues
            SET current_token = NULL
            WHERE id = ?
            AND business_id = ?
          `;

        db.query(updateQueueQuery, [queueId, businessId], (error) => {
          if (error) {
            callback(error, null);
            return;
          }

          callback(null, {
            queue_id: queueId,
            cancelled_token: queue.current_token,
            status: 'CANCELLED',
          });
        });
      }
    );
  });
}

module.exports = {
  getQueueByServiceId,
  callNextCustomer,
  completeCurrentCustomer,
  createQueue,
  updateQueueStatus,
  skipCurrentCustomer,
  cancelCurrentCustomer,
};
