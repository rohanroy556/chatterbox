const { Router } = require('express');

const auth = require('./auth');
const chat = require('./chat');
const user = require('./user');

const router = Router();

router.use('/chat', chat);
router.use('/auth', auth);
router.use('/user', user);

module.exports = router;