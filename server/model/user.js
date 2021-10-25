const mongoose = require('mongoose');
const schema = require('../schema');

/**
 * Create a model for user schema
 */
const User = mongoose.model('User', schema.User);

module.exports = User;