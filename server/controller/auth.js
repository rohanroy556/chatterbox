const { Router } = require('express');
const { auth } = require('../service');

const router = Router();

router.get('/validate', auth.required, (req, res) => {
    const { payload: { id } } = req;
    res.status(id ? 200 : 401).end();
});

module.exports = router;