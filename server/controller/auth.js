const { Router } = require('express');
const { auth } = require('../service');

const router = Router();

/**
 * A route for authenticating jwt tokens. If the token is valid and is not expired.
 * This route is only open to requests with bearer token.
 */
router.get('/validate', auth.required, (req, res) => {
    const { payload: { id } } = req;
    res.status(id ? 200 : 401).end();
});

module.exports = router;