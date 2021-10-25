const path = require('path');
const { Router } = require('express');
const config = require('../config');

const router = Router();

/**
 * A route for chat application i.e. the Angular front-end.
 * This route is open to all users.
 */
router.get('*', (req, res) => res.sendFile(path.join(config.OUTPUT_PATH, "/index.html")));

module.exports = router;