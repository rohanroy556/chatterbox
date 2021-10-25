const passport = require('passport');
const { User } = require('../model');

/**
 * User Service to add new user or fetch an existing user.
 */
const UserService = {};

/**
 * Add a new user to the database.
 * @param {string} email of the user
 * @param {string} password to be hashed
 * @param {string} name of the user
 * @returns {object} user object along with JWT token
 */
UserService.post = (email, password, name) => {
    return new Promise((resolve, reject) => {
        if (!email || !password || !name) {
            return reject({ status: 400, message: 'Email, Password and Name is required' });
        }
        User.exists({ email }, (err, result) => {
            if (err) return reject({ status: 500, message: 'Some Error has occured' });
            else if (result) return reject({ status: 400, message: 'Email already exists' });
            const user = new User({ email, password, name });
            user.save().then(
                () => resolve(user.toAuthJSON()),
                error => reject({ status: 500, message: 'Some Error occured while saving User in DB' })
            );
        });
    });
};

/**
 * Fetch an existing user from the database.
 * Authenticate the credentials using passport.
 * @param {object} request express request object
 * @param {object} response express response object
 * @param {function} next callback function to the next middleware
 * @returns {object} user object along with JWT token
 */
UserService.get = (req, res, next) => {
    return new Promise((resolve, reject) => {
        const { body: { email, password } } = req;
        if (!email || !password) {
            return reject({ status: 400, message: 'Email and Password is required' });
        }
        passport.authenticate('local', { session: false }, (err, user) => {
            if (err || !user) return reject(err || { status: 500, message: 'Some Error has occured' });
            user.token = user.generateJWT();
            return resolve(user.toAuthJSON());
        })(req, res, next);
    });
};

module.exports = UserService;