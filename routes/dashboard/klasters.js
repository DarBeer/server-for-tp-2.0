const express = require('express');
const multer  = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './assets/img/klasters')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
});

const upload  = multer({ storage: storage });

const { ensureAuthenticated } = require('../../config/auth');

// klaster model
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

// Render klaster Edit Page
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Klaster.findById({ _id: req.params.id })
        .then(klaster => {
            heading = klaster.name;
            description = klaster.description;
            date = klaster.date;
            res.render('klaster-page-dashboard', { heading, description, date });
        })
        .catch(err => {
            console.log(err)
        });
});

// Edit klaster Handle
router.post('/edit/:id', ensureAuthenticated, (req, res) => {
    const { 
        heading, 
        description
    } = req.body;
    const date = Date.now();
    // if (!req.file == 'undefined') {
    //     console.log(req.file);
    //     const urlImage = "http://localhost/assets/img/klasters/" + req.file.originalname;
    // }
    
    console.log(heading + " " + description);

    let errors = [];

    // Check required fields
    if (!heading || !description) {
        errors.push({ msg: 'Заполните обязательные поля (*)' });
    }

    if (errors.length > 0) {
        console.dir(errors);
        res.render('klaster-page-dashboard', { 
            errors, 
            heading, 
            description
        });
    } else {

        Klaster.findByIdAndUpdate(
            { _id: req.params.id }, 
            { 
                name: heading,
                description: description,
                date: date
             } )
        .then(klaster => {
            req.flash('success_msg', 'Статья обновлена!');
            res.redirect('/dashboard/klasters');
        })
        .catch(err => console.log(err));
    }

    
});

// Render New klaster Page
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('klaster-page-dashboard');
});

// Add New klaster Handle
router.post('/add', ensureAuthenticated, (req, res) => {
    const { 
        name, 
        description
    } = req.body;
    const date = Date.now();
    if (!req.file == 'indefined') {
        const urlImage = "http://localhost/assets/img/klasters/" + req.file.originalname;
    } else {
        const urlImage = "http://loclahost/assets/img/noimage.png"
    }
    let errors = [];

    // Check required fields
    if (!name || !description) {
        errors.push({ msg: 'Заполните обязательные поля (*)' });
    }

    if (errors.length > 0) {
        res.render('klaster-page-dashboard', { errors, name, description });
    } else {
        const newKlaster = new Klaster ({
            name, 
            description, 
            date
        });
    
        newKlaster.save()
            .then(klaster => {
                req.flash('success_msg', 'Статья добавленна!');
                res.redirect('/dashboard/klasters');
            })
            .catch(err => console.log(err));
    }
});

// DELETE klaster
router.get('/del/:id', ensureAuthenticated, (req, res) => {
    Klaster.findOneAndRemove({ _id: req.params.id })
        .then(klaster => {
            req.flash('success_msg', 'Статья удалена!');
            res.redirect('/dashboard/klasters');
        })
        .catch(err => console.log(err));
});

module.exports = router;