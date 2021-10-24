const mongoose = require('mongoose');
const schema = require('../schema');

const User = mongoose.model('User', schema.User);

module.exports = User;