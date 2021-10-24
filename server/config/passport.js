const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const { User } = require('../model');

passport.serializeUser(function (user, done) {
    done(null, user._id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

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