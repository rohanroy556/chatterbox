const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const { User } = require('../model');

/**
 * Configure passport to serialize user.
 */
passport.serializeUser(function (user, done) {
    done(null, user._id);
});

/**
 * Configure passport to de-serialize user.
 */
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

/**
 * Configure passport use local strategy to validate user. Here email and password is used to search a user in database.
 */
passport.use('local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
}, (email, password, done) => {
    User.findOne({ email }).then(
        user => !user || !user.validatePassword(password)
            ? done({ status: 401, message: 'Invalid Email or Password' }, null)
            : done(null, user),
        error => done({ status: 500, message: 'Some Error has occured' }, null)
    );
}));

module.exports = passport;