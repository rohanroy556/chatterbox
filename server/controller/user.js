const { Router } = require('express');
const { auth, User } = require('../service');

const router = Router();
/**
 * A route for logging in an existing user using credentials.
 * The body of the request contains the email and the password.
 */
router.post('/login', (req, res, next) => {
    User.get(req, res, next).then(
        user => res.status(200).json(user),
        error => res.status(error.status || 500).send(error.message || 'Some Error has occured')
    );
});

/**
 * A route for signing up a new user.
 * The body of the request contains the email, the password and the name of the user.
 */
router.post('/signup', (req, res) => {
    const { body: { email, password, name } } = req;
    User.post(email, password, name).then(
        user => res.status(201).json(user),
        error => res.status(error.status || 500).send(error.message || 'Some Error has occured')
    );
});

module.exports = router;