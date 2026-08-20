const db = require('../db/connection');

function getBusinesses(category, callback) {
  let query = `
      SELECT
        id,
        name,
        category,
        address,
        latitude,
        longitude
      FROM businesses
    `;

  const params = [];

  if (category) {
    query += `
        WHERE category = ?
      `;

    params.push(category);
  }

  query += `
      ORDER BY name ASC
    `;

  db.query(query, params, (error, businesses) => {
    if (error) {
      callback(error, null);
      return;
    }

    callback(null, businesses);
  });
}

function getBusinessById(id, callback) {
  const query = 'SELECT * FROM businesses WHERE id = ?';

  db.query(query, [id], (error, results) => {
    if (error) {
      callback(error, null);
      return;
    }

    callback(null, results[0]);
  });
}

function searchBusinesses(searchTerm, callback) {
  const query = `
      SELECT
        id,
        name,
        category,
        address,
        latitude,
        longitude
      FROM businesses
      WHERE name LIKE ?
         OR category LIKE ?
         OR address LIKE ?
      ORDER BY name ASC
    `;

  const searchPattern = `%${searchTerm}%`;

  db.query(
    query,
    [searchPattern, searchPattern, searchPattern],
    (error, businesses) => {
      if (error) {
        callback(error, null);
        return;
      }

      callback(null, businesses);
    }
  );
}

function calculateDistance(latitude1, longitude1, latitude2, longitude2) {
  const earthRadius = 6371;

  const toRadians = (degrees) => {
    return (degrees * Math.PI) / 180;
  };

  const lat1 = toRadians(latitude1);
  const lat2 = toRadians(latitude2);

  const latitudeDifference = toRadians(latitude2 - latitude1);

  const longitudeDifference = toRadians(longitude2 - longitude1);

  const a =
    Math.sin(latitudeDifference / 2) * Math.sin(latitudeDifference / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(longitudeDifference / 2) *
      Math.sin(longitudeDifference / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
}

function getNearbyBusinesses(latitude, longitude, radius, callback) {
  const query = `
      SELECT
        id,
        name,
        category,
        address,
        latitude,
        longitude
      FROM businesses
    `;

  db.query(query, (error, businesses) => {
    if (error) {
      callback(error, null);
      return;
    }

    const nearbyBusinesses = businesses
      .map((business) => {
        const distance = calculateDistance(
          Number(latitude),
          Number(longitude),
          Number(business.latitude),
          Number(business.longitude)
        );

        return {
          ...business,
          distance_km: Number(distance.toFixed(2)),
        };
      })
      .filter((business) => {
        return business.distance_km <= Number(radius);
      })
      .sort((a, b) => {
        return a.distance_km - b.distance_km;
      });

    callback(null, nearbyBusinesses);
  });
}

function getBusinessCategories(callback) {
  const query = `
    SELECT
      id,
      name
    FROM business_categories
    ORDER BY name ASC
  `;

  db.query(query, (error, results) => {
    if (error) {
      callback(error, null);
      return;
    }

    callback(null, results);
  });
}

module.exports = {
  getBusinesses,
  getBusinessById,
  searchBusinesses,
  calculateDistance,
  getNearbyBusinesses,
  getBusinessCategories,
};
