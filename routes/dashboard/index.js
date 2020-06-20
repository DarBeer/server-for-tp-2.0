const express = require('express');
const { ensureAuthenticated } = require('../../config/auth');

const router = express.Router();

router.get('/', ensureAuthenticated, (req, res) => {
    res.redirect('dashboard/articles');
});

router.use('/articles', require('./articles'));
router.use('/services', require('./services'));
router.use('/investors', require('./investors'));
router.use('/klasters', require('./klasters'));

module.exports = router;