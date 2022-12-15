const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  if (!email || typeof email !== 'string') {
    return null;
  }
  
  const query = {
    text: `
      SELECT
        *
      FROM users
      WHERE email = $1
      ;`,
    values: [email.toLowerCase()],
  };
  
  return pool
    .query(query)
    .then((result) => {
      let rows = result.rows;
      if (rows.length === 0) {
        return null;
      }
      return rows[0];
    })
    .catch(err => console.error('query error', err.stack));
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  if (!id || typeof id !== 'number') {
    return null;
  }
  
  const query = {
    text: `
      SELECT
        *
      FROM users
      WHERE id = $1
      ;`,
    values: [id],
  };
  
  return pool
    .query(query)
    .then((result) => {
      let rows = result.rows;
      if (rows.length === 0) {
        return null;
      }
      return rows[0];
    })
    .catch(err => console.error('query error', err.stack));
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  const query = {
    text: `
      INSERT INTO users
        (name, email, password)
      VALUES
        ($1, $2, $3)
      RETURNING *
      ;`,
    values: [user.name, user.email, user.password],
  };
  
  return pool
    .query(query)
    .then((result) => {
      let rows = result.rows;
      if (rows.length === 0) {
        return null;
      }
      return rows[0];
    })
    .catch(err => console.error('query error', err.stack));
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return getAllProperties(null, 2);
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  const query = {
    text: `
      SELECT
        *
      FROM properties
      FETCH FIRST $1 ROWS ONLY
      ;`,
    values: [limit],
  };
  
  return pool
    .query(query)
    .then((result) => {
      return result.rows;
    })
    .catch(err => console.error('query error', err.stack));
}
exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
