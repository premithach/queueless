const db = require('../db/connection');

function getServicesByBusinessId(businessId, callback) {
  const query = `
    SELECT *
    FROM services
    WHERE business_id = ?
  `;

  db.query(query, [businessId], (error, results) => {
    if (error) {
      callback(error, null);
      return;
    }

    callback(null, results);
  });
}

function createService(
  businessId,
  name,
  description,
  averageServiceTime,
  callback
) {
  const query = `
      INSERT INTO services
      (business_id, name, description, average_service_time)
      VALUES (?, ?, ?, ?)
    `;

  db.query(
    query,
    [businessId, name, description || null, averageServiceTime],
    (error, result) => {
      if (error) {
        callback(error, null);
        return;
      }

      callback(null, {
        id: result.insertId,
        business_id: businessId,
        name,
        description: description || null,
        average_service_time: averageServiceTime,
      });
    }
  );
}

function updateService(
  serviceId,
  businessId,
  name,
  description,
  averageServiceTime,
  callback
) {
  // First make sure the service belongs to this business
  const checkQuery = `
      SELECT id
      FROM services
      WHERE id = ?
      AND business_id = ?
    `;

  db.query(checkQuery, [serviceId, businessId], (error, services) => {
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

    const updateQuery = `
          UPDATE services
          SET
            name = ?,
            description = ?,
            average_service_time = ?
          WHERE id = ?
          AND business_id = ?
        `;

    db.query(
      updateQuery,
      [name, description || null, averageServiceTime, serviceId, businessId],
      (error) => {
        if (error) {
          callback(error, null);
          return;
        }

        callback(null, {
          id: Number(serviceId),
          business_id: Number(businessId),
          name,
          description: description || null,
          average_service_time: averageServiceTime,
        });
      }
    );
  });
}

function deleteService(serviceId, businessId, callback) {
  const checkQuery = `
      SELECT id
      FROM services
      WHERE id = ?
      AND business_id = ?
    `;

  db.query(checkQuery, [serviceId, businessId], (error, services) => {
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
          error: 'SERVICE_HAS_QUEUE',
        });
        return;
      }

      const deleteQuery = `
              DELETE FROM services
              WHERE id = ?
              AND business_id = ?
            `;

      db.query(deleteQuery, [serviceId, businessId], (error) => {
        if (error) {
          callback(error, null);
          return;
        }

        callback(null, {
          id: Number(serviceId),
          message: 'Service deleted successfully',
        });
      });
    });
  });
}

module.exports = {
  getServicesByBusinessId,
  createService,
  updateService,
  deleteService,
};
