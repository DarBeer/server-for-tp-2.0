const express = require('express');
const { ensureAuthenticated } = require('../../config/auth');

// Service model
const Service = require('../../models/Service');

const router = express.Router();

// Render Services Page
router.get('/', ensureAuthenticated, (req, res) => {
    Service.find().lean()
        .then(services => {
            res.render('services-dashboard', { services });
        })
        .catch(err => {
            console.log(err);
            res.render('services-dashboard');
        });
    
});

module.exports = router;