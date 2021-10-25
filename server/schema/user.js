const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

const { Schema } = mongoose;

/**
 * Create a schema for users.
 * Each user will have an email and name, along with password hash and its salt.
 */
const UserSchema = new Schema({
  email: { type: String, unique: true, required: true },
  hash: { type: String, required: true },
  salt: { type: String, required: true },
  name: { type: String, required: true }
});

/**
 * Each user will have a virtual property password, which will not be stored in the database.
 * This property is used to generate a hash and its corresponding salt which is rather store in database.
 */
UserSchema.virtual('password')
  .get(function() {
    return this.hash;
  })
  .set(function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  });

/**
 * Methods added to the schema.
 * They are useful for performing operations on the document.
 */

/**
 * Password validation against the stored hash.
 * @param {string} password to be validated
 * @returns {boolean} whether a valid password or not
 */
UserSchema.methods.validatePassword = function(password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};

/**
 * Generate JWT token that contains email, _id and name, along with exp, which token expiry.
 * The token expiry is set till the new day.
 * @returns {string} signed JWT token
 */
UserSchema.methods.generateJWT = function() {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 1);

  return jwt.sign({
    email: this.email,
    id: this._id,
    exp: parseInt(expirationDate.getTime() / 1000, 10),
    name: this.name
  }, JWT_SECRET);
};

/**
 * Authorized user object that contains _id, email, jwt token and name.
 * @returns {object} user object
 */
UserSchema.methods.toAuthJSON = function() {
  return {
    _id: this._id,
    email: this.email,
    token: this.generateJWT(),
    name: this.name
  };
};

module.exports = UserSchema;