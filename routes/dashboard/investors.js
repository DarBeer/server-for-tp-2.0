const express = require('express');
const { ensureAuthenticated } = require('../../config/auth');

// Investor model
const Investor = require('../../models/Investor');

const router = express.Router();

// Render Investors Page
router.get('/', ensureAuthenticated, (req, res) => {
    Investor.find().lean()
        .then(investors => {
            res.render('investors-dashboard', { investors });
        })
        .catch(err => {
            console.log(err);
            res.render('investors-dashboard');
        });
    
});

module.exports = router;