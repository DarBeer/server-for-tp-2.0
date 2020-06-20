const express = require('express');
const { ensureAuthenticated } = require('../../config/auth');

// Klaster model
const Klaster = require('../../models/Klaster');

const router = express.Router();

// Render Klaster Page
router.get('/', ensureAuthenticated, (req, res) => {
    Klaster.find().lean()
        .then(klasters => {
            res.render('klaster-dashboard', { klasters });
        })
        .catch(err => {
            console.log(err);
            res.render('klaster-dashboard');
        });
    
});

module.exports = router;