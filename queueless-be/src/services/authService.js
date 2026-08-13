const crypto = require('crypto');
const db = require('../db/connection');

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function createSession(userId, callback) {
  const token = crypto.randomBytes(32).toString('hex');

  const query = `
      INSERT INTO sessions (user_id, token)
      VALUES (?, ?)
    `;

  db.query(query, [userId, token], (error) => {
    if (error) {
      callback(error, null);
      return;
    }

    callback(null, token);
  });
}

function getUserFromToken(token, callback) {
  const query = `
      SELECT
        users.id,
        users.name,
        users.email,
        users.role,
        users.business_id
      FROM sessions
      JOIN users
        ON sessions.user_id = users.id
      WHERE sessions.token = ?
    `;

  db.query(query, [token], (error, users) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (users.length === 0) {
      callback(null, null);
      return;
    }

    callback(null, users[0]);
  });
}

function registerUser(name, email, password, role, callback) {
  const checkUserQuery = `
    SELECT id
    FROM users
    WHERE email = ?
  `;

  db.query(checkUserQuery, [email], (error, users) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (users.length > 0) {
      callback(null, {
        error: 'EMAIL_EXISTS',
      });
      return;
    }

    const hashedPassword = hashPassword(password);

    const insertUserQuery = `
      INSERT INTO users
      (name, email, password, role)
      VALUES (?, ?, ?, ?)
    `;

    db.query(
      insertUserQuery,
      [name, email, hashedPassword, role],
      (error, result) => {
        if (error) {
          callback(error, null);
          return;
        }

        callback(null, {
          id: result.insertId,
          name,
          email,
          role,
        });
      }
    );
  });
}

function loginUser(email, password, callback) {
  const query = `
      SELECT id, name, email, password, role, business_id
      FROM users
      WHERE email = ?
    `;

  db.query(query, [email], (error, users) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (users.length === 0) {
      callback(null, {
        error: 'INVALID_CREDENTIALS',
      });
      return;
    }

    const user = users[0];

    const hashedPassword = hashPassword(password);

    if (hashedPassword !== user.password) {
      callback(null, {
        error: 'INVALID_CREDENTIALS',
      });
      return;
    }

    createSession(user.id, (error, token) => {
      if (error) {
        callback(error, null);
        return;
      }

      callback(null, {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        business_id: user.business_id,
        token,
      });
    });
  });
}

function registerBusiness(
  userName,
  email,
  password,
  businessName,
  category,
  address,
  latitude,
  longitude,
  callback
) {
  const checkUserQuery = `
      SELECT id
      FROM users
      WHERE email = ?
    `;

  db.query(checkUserQuery, [email], (error, users) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (users.length > 0) {
      callback(null, {
        error: 'EMAIL_EXISTS',
      });
      return;
    }

    const createBusinessQuery = `
        INSERT INTO businesses
        (name, category, address, latitude, longitude)
        VALUES (?, ?, ?, ?, ?)
      `;

    db.query(
      createBusinessQuery,
      [businessName, category, address, latitude || null, longitude || null],
      (error, businessResult) => {
        if (error) {
          callback(error, null);
          return;
        }

        const businessId = businessResult.insertId;
        const hashedPassword = hashPassword(password);

        const createUserQuery = `
            INSERT INTO users
            (name, email, password, role, business_id)
            VALUES (?, ?, ?, 'BUSINESS', ?)
          `;

        db.query(
          createUserQuery,
          [userName, email, hashedPassword, businessId],
          (error, userResult) => {
            if (error) {
              callback(error, null);
              return;
            }

            callback(null, {
              user: {
                id: userResult.insertId,
                name: userName,
                email,
                role: 'BUSINESS',
                business_id: businessId,
              },
              business: {
                id: businessId,
                name: businessName,
                category,
                address,
                latitude: latitude || null,
                longitude: longitude || null,
              },
            });
          }
        );
      }
    );
  });
}

module.exports = {
  registerUser,
  loginUser,
  createSession,
  getUserFromToken,
  registerBusiness,
};
