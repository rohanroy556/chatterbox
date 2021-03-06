const jwt = require('express-jwt');
const { JWT_SECRET } = require('../config');

/**
 * Extracts JWT token from the express request.
 * @param {object} request express request object
 * @returns {string | null} JWT token
 */
const getToken = (req) => {
  const { headers: { authorization } } = req;
  return authorization && authorization.split(' ')[0] === 'Bearer'
    ? authorization.split(' ')[1]
    : null;
};

/**
 * Express JWT middleware for routes.
 */
const auth = {
  required: jwt({
    algorithms: ['HS256'],
    secret: JWT_SECRET,
    userProperty: 'payload',
    getToken,
  }),
  optional: jwt({
    algorithms: ['HS256'],
    secret: JWT_SECRET,
    userProperty: 'payload',
    getToken,
    credentialsRequired: false,
  })
};

module.exports = auth;