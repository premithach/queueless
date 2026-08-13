const db = require('../db/connection');

function joinQueue(queueId, userId, callback) {
  const queueQuery = `
    SELECT *
    FROM queues
    WHERE id = ?
  `;

  db.query(queueQuery, [queueId], (error, queues) => {
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

    // Check if customer already has an active token
    const existingTokenQuery = `
      SELECT *
      FROM queue_tokens
      WHERE queue_id = ?
      AND user_id = ?
      AND status IN ('WAITING', 'SERVING')
      LIMIT 1
    `;

    db.query(existingTokenQuery, [queueId, userId], (error, tokens) => {
      if (error) {
        callback(error, null);
        return;
      }

      if (tokens.length > 0) {
        callback(null, {
          error: 'ALREADY_JOINED',
          token: tokens[0],
        });
        return;
      }

      // Find the latest token number
      const tokenQuery = `
          SELECT MAX(token_number) AS last_token
          FROM queue_tokens
          WHERE queue_id = ?
        `;

      db.query(tokenQuery, [queueId], (error, results) => {
        if (error) {
          callback(error, null);
          return;
        }

        const lastToken = results[0].last_token || 0;
        const nextToken = lastToken + 1;

        const insertQuery = `
            INSERT INTO queue_tokens
            (queue_id, user_id, token_number, status)
            VALUES (?, ?, ?, 'WAITING')
          `;

        db.query(insertQuery, [queueId, userId, nextToken], (error, result) => {
          if (error) {
            callback(error, null);
            return;
          }

          callback(null, {
            id: result.insertId,
            queue_id: queueId,
            user_id: userId,
            token_number: nextToken,
            status: 'WAITING',
          });
        });
      });
    });
  });
}

function getPeopleAhead(queueId, tokenNumber, callback) {
  const query = `
      SELECT COUNT(*) AS people_ahead
      FROM queue_tokens
      WHERE queue_id = ?
      AND token_number < ?
      AND status IN ('WAITING', 'SERVING')
    `;

  db.query(query, [queueId, tokenNumber], (error, results) => {
    if (error) {
      callback(error, null);
      return;
    }

    callback(null, results[0].people_ahead);
  });
}

function getTokenById(tokenId, callback) {
  const query = `
      SELECT *
      FROM queue_tokens
      WHERE id = ?
    `;

  db.query(query, [tokenId], (error, results) => {
    if (error) {
      callback(error, null);
      return;
    }

    callback(null, results[0]);
  });
}

function getEstimatedWait(queueId, tokenNumber, callback) {
  const query = `
      SELECT
        COUNT(*) AS people_ahead,
        services.average_service_time
      FROM queue_tokens
      JOIN queues
        ON queue_tokens.queue_id = queues.id
      JOIN services
        ON queues.service_id = services.id
      WHERE queue_tokens.queue_id = ?
        AND queue_tokens.token_number < ?
        AND queue_tokens.status IN ('WAITING', 'SERVING')
      GROUP BY services.average_service_time
    `;

  db.query(query, [queueId, tokenNumber], (error, results) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (results.length === 0) {
      callback(null, {
        peopleAhead: 0,
        averageServiceTime: 0,
        estimatedWaitMinutes: 0,
      });

      return;
    }

    const peopleAhead = results[0].people_ahead;
    const averageServiceTime = results[0].average_service_time;

    const estimatedWaitMinutes = peopleAhead * averageServiceTime;

    callback(null, {
      peopleAhead,
      averageServiceTime,
      estimatedWaitMinutes,
    });
  });
}

function cancelToken(tokenId, userId, callback) {
  const query = `
      SELECT *
      FROM queue_tokens
      WHERE id = ?
    `;

  db.query(query, [tokenId], (error, tokens) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (tokens.length === 0) {
      callback(null, {
        error: 'TOKEN_NOT_FOUND',
      });
      return;
    }

    const token = tokens[0];

    // Make sure the token belongs to the logged-in customer
    if (token.user_id !== userId) {
      callback(null, {
        error: 'NOT_TOKEN_OWNER',
      });
      return;
    }

    // Only an active waiting token can be cancelled
    if (token.status !== 'WAITING') {
      callback(null, {
        error: 'TOKEN_CANNOT_BE_CANCELLED',
        status: token.status,
      });
      return;
    }

    const updateQuery = `
        UPDATE queue_tokens
        SET status = 'CANCELLED'
        WHERE id = ?
      `;

    db.query(updateQuery, [tokenId], (error) => {
      if (error) {
        callback(error, null);
        return;
      }

      callback(null, {
        id: token.id,
        queue_id: token.queue_id,
        user_id: token.user_id,
        token_number: token.token_number,
        status: 'CANCELLED',
      });
    });
  });
}

function getQueueHistory(userId, callback) {
  const query = `
      SELECT
        queue_tokens.id,
        queue_tokens.token_number,
        queue_tokens.status,
        queue_tokens.joined_at,
        queue_tokens.called_at,
        queue_tokens.completed_at,
        businesses.name AS business_name,
        services.name AS service_name
      FROM queue_tokens
      JOIN queues
        ON queue_tokens.queue_id = queues.id
      JOIN businesses
        ON queues.business_id = businesses.id
      JOIN services
        ON queues.service_id = services.id
      WHERE queue_tokens.user_id = ?
      ORDER BY queue_tokens.created_at DESC
    `;

  db.query(query, [userId], (error, history) => {
    if (error) {
      callback(error, null);
      return;
    }

    callback(null, history);
  });
}

function getQueueTokens(queueId, businessId, callback) {
  const query = `
      SELECT
        queue_tokens.id,
        queue_tokens.queue_id,
        queue_tokens.user_id,
        queue_tokens.token_number,
        queue_tokens.status,
        queue_tokens.joined_at,
        queue_tokens.called_at,
        queue_tokens.completed_at,
        users.name AS customer_name
      FROM queue_tokens
      JOIN users
        ON queue_tokens.user_id = users.id
      JOIN queues
        ON queue_tokens.queue_id = queues.id
      WHERE queue_tokens.queue_id = ?
        AND queues.business_id = ?
      ORDER BY queue_tokens.token_number ASC
    `;

  db.query(query, [queueId, businessId], (error, tokens) => {
    if (error) {
      callback(error, null);
      return;
    }

    callback(null, tokens);
  });
}

function getBusinessQueueHistory(queueId, businessId, callback) {
  const query = `
      SELECT
        queue_tokens.id,
        queue_tokens.queue_id,
        queue_tokens.user_id,
        queue_tokens.token_number,
        queue_tokens.status,
        queue_tokens.joined_at,
        queue_tokens.called_at,
        queue_tokens.completed_at,
        users.name AS customer_name
      FROM queue_tokens
      JOIN users
        ON queue_tokens.user_id = users.id
      JOIN queues
        ON queue_tokens.queue_id = queues.id
      WHERE queue_tokens.queue_id = ?
        AND queues.business_id = ?
        AND queue_tokens.status IN ('COMPLETED', 'SKIPPED', 'CANCELLED')
      ORDER BY queue_tokens.created_at DESC
    `;

  db.query(query, [queueId, businessId], (error, history) => {
    if (error) {
      callback(error, null);
      return;
    }

    callback(null, history);
  });
}

function getQueueStatistics(queueId, businessId, callback) {
  const query = `
      SELECT
        COUNT(*) AS total_customers,
  
        SUM(
          CASE
            WHEN queue_tokens.status = 'COMPLETED' THEN 1
            ELSE 0
          END
        ) AS completed,
  
        SUM(
          CASE
            WHEN queue_tokens.status = 'SKIPPED' THEN 1
            ELSE 0
          END
        ) AS skipped,
  
        SUM(
          CASE
            WHEN queue_tokens.status = 'CANCELLED' THEN 1
            ELSE 0
          END
        ) AS cancelled,
  
        AVG(
          CASE
            WHEN queue_tokens.called_at IS NOT NULL
            THEN TIMESTAMPDIFF(
              MINUTE,
              queue_tokens.joined_at,
              queue_tokens.called_at
            )
          END
        ) AS average_wait_time,
  
        AVG(
          CASE
            WHEN queue_tokens.status = 'COMPLETED'
            AND queue_tokens.completed_at IS NOT NULL
            AND queue_tokens.called_at IS NOT NULL
            THEN TIMESTAMPDIFF(
              MINUTE,
              queue_tokens.called_at,
              queue_tokens.completed_at
            )
          END
        ) AS average_service_time
  
      FROM queue_tokens
      JOIN queues
        ON queue_tokens.queue_id = queues.id
  
      WHERE queue_tokens.queue_id = ?
        AND queues.business_id = ?
    `;

  db.query(query, [queueId, businessId], (error, results) => {
    if (error) {
      console.error('Queue statistics error:', error);
      callback(error, null);
      return;
    }

    const statistics = results[0];

    callback(null, {
      total_customers: Number(statistics.total_customers),
      completed: Number(statistics.completed || 0),
      skipped: Number(statistics.skipped || 0),
      cancelled: Number(statistics.cancelled || 0),
      average_wait_time: Number(statistics.average_wait_time || 0),
      average_service_time: Number(statistics.average_service_time || 0),
    });
  });
}

module.exports = {
  joinQueue,
  getPeopleAhead,
  getTokenById,
  getEstimatedWait,
  cancelToken,
  getQueueHistory,
  getQueueTokens,
  getBusinessQueueHistory,
  getQueueStatistics,
};
