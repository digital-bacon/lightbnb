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
  if (!guest_id || typeof guest_id !== 'number') {
    return null;
  }
  
  const query = {
    text: `
      SELECT
        reservations.id,
        properties.title,
        properties.thumbnail_photo_url,
        properties.parking_spaces,
        properties.number_of_bathrooms,
        properties.number_of_bedrooms,
        properties.cost_per_night,
        reservations.start_date,
        AVG(property_reviews.rating) AS average_rating
      FROM reservations
      JOIN properties
        ON properties.id = reservations.property_id
      JOIN property_reviews
        ON property_reviews.property_id = reservations.property_id
      WHERE reservations.guest_id = $1
      GROUP BY
        properties.id,
        reservations.id
      ORDER BY reservations.start_date
      FETCH FIRST $2 ROWS ONLY
      ;`,
    values: [guest_id, limit],
  };
  
  return pool
    .query(query)
    .then((result) => {
      let rows = result.rows;
      if (rows.length === 0) {
        return null;
      }
      return rows;
    })
    .catch(err => console.error('query error', err.stack)); 
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

  const queryParams = [];
  queryParams.push(limit);

  const query = {
    text: `
      SELECT
        properties.*,
        AVG(rating) AS average_rating
      FROM properties
      JOIN property_reviews
        ON property_id = properties.id`,
  };

  if (options.city) {
    // TODO: sanitize input against SQL injection
    queryParams.push(`%${options.city}%`);
    if (!query.text.includes('WHERE')) {
      query.text += `
      WHERE `;
    } else {
      query.text += `
      AND `;
    }
    query.text += `city LIKE $${queryParams.length}`;
  };

  if (options.owner_id) {
    queryParams.push(options.owner_id);
    if (!query.text.includes('WHERE')) {
      query.text += `
      WHERE `;
    } else {
      query.text += `
      AND `;
    }

    query.text += `owner_id = $${queryParams.length}`;
  };
  
  query.text += `
    GROUP BY properties.id, title, cost_per_night`;

  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    if (!query.text.includes('HAVING')) {
      query.text += `
      HAVING `;
    } else {
      query.text += `
      AND `;
    }

    query.text += `AVG(rating) >= $${queryParams.length}`;
  };

  if (options.minimum_price_per_night) {
    const minPriceInDollars = options.minimum_price_per_night * 100;
    queryParams.push(minPriceInDollars);
    if (!query.text.includes('HAVING')) {
      query.text += `
      HAVING `;
    } else {
      query.text += `
      AND `;
    }

    query.text += `cost_per_night >= $${queryParams.length}`;
  };

  if (options.maximum_price_per_night) {
    // TODO: ensure that, given a min price as well, max is higher than min
    const maxPriceInDollars = options.maximum_price_per_night * 100;
    queryParams.push(maxPriceInDollars);
    if (!query.text.includes('HAVING')) {
      query.text += `
      HAVING `;
    } else {
      query.text += `
      AND `;
    }

    query.text += `cost_per_night <= $${queryParams.length}`;
  };

  query.text += `
    ORDER BY cost_per_night ASC
    FETCH FIRST $1 ROWS ONLY
    ;`;

  query.values = queryParams

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
  const query = {
    text: `
      INSERT INTO properties (
        owner_id, 
        title, 
        description, 
        thumbnail_photo_url, 
        cover_photo_url, 
        cost_per_night, 
        street, 
        city, 
        province, 
        post_code, 
        country, 
        parking_spaces, 
        number_of_bathrooms, 
        number_of_bedrooms
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
      ;`,
    values: [
      property.owner_id,
      property.title,
      property.description,
      property.thumbnail_photo_url,
      property.cover_photo_url,
      property.cost_per_night,
      property.street,
      property.city,
      property.province,
      property.post_code,
      property.country,
      property.parking_spaces,
      property.number_of_bathrooms,
      property.number_of_bedrooms
    ],
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
exports.addProperty = addProperty;
