const path = require('path');
const { Router } = require('express');
const config = require('../config');
const { auth } = require('../service');

const router = Router();

router.get('*', (req, res) => res.sendFile(path.join(config.OUTPUT_PATH, "/index.html")));

module.exports = router;