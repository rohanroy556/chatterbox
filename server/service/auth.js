const jwt = require('express-jwt');
const { JWT_SECRET } = require('../config');

const getToken = (req) => {
  const { headers: { authorization } } = req;
  return authorization && authorization.split(' ')[0] === 'Bearer'
    ? authorization.split(' ')[1]
    : null;
};

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