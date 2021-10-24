const { Router } = require('express');
const { auth, User } = require('../service');

const router = Router();

router.post('/login', (req, res, next) => {
    User.get(req, res, next).then(
        user => res.status(200).json(user),
        error => res.status(error.status || 500).send(error.message || 'Some Error has occured')
    );
});

router.post('/signup', (req, res) => {
    const { body: { email, password, name } } = req;
    User.post(email, password, name).then(
        user => res.status(201).json(user),
        error => res.status(error.status || 500).send(error.message || 'Some Error has occured')
    );
});

module.exports = router;