const express = require('express');
const router = express.Router();

router.use('/users', require('./users'));
router.use('/dashboard', require('./dashboard'));

router.get('/', (req, res) => {
    res.redirect('dashboard');
});

module.exports = router;