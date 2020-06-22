const express = require('express');
const multer  = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './assets/img/invesrots')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
});

const upload  = multer({ storage: storage });

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

// Render Investor Edit Page
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Investor.findById({ _id: req.params.id })
        .then(investor => {
            name = investor.name;
            urlToInv = investor.urlToInv;
            urlImage = investor.urlImage;
            res.render('investor-page-dashboard', { name, urlToInv, urlImage });
        })
        .catch(err => {
            console.log(err)
        });
});

// Edit Investor Handle
router.post('/edit/:id', ensureAuthenticated, (req, res) => {
    const { 
        name, 
        urlToInv 
    } = req.body;
    const urlImage = "http://localhost/assets/img/invesrots/" + req.body.urlImage;

    let errors = [];

    // Check required fields
    if (!name || !urlToInv) {
        errors.push({ msg: 'Заполните обязательные поля (*)' });
    }

    if (errors.length > 0) {
        res.render('investor-page-dashboard', { 
            errors, 
            name, 
            urlToInv,
            urlImage
        });
    } else {

        Investor.findByIdAndUpdate(
            { _id: req.params.id }, 
            { 
                name: name,
                urlToInv: urlToInv,
                urlImage: urlImage 
            })
        .then(investor => {
            req.flash('success_msg', 'Статья обновлена!');
            res.redirect('/dashboard/investors');
        })
        .catch(err => console.log(err));
    }

    
});

// Render New Investor Page
router.get('/add', ensureAuthenticated, (req, res) => {
    urlImage = 'noimage.png'
    res.render('investor-page-dashboard', { urlImage });
});

// Add New Investor Handle
router.post('/add', ensureAuthenticated, (req, res) => {
    const { 
        name,
        urlToInv
    } = req.body;
    const urlImage = "http://localhost/assets/img/invesrots/" + req.body.urlImage;
    let errors = [];

    // Check required fields
    if (!name || !urlToInv) {
        errors.push({ msg: 'Заполните обязательные поля (*)' });
    }

    if (errors.length > 0) {
        res.render('investor-page-dashboard', { 
            errors,
            name,
            urlToInv,
            urlImage
        });
    } else {
        const newInvestor = new Investor ({
            name,
            urlToInv,
            urlImage
        });
    
        newInvestor.save()
            .then(investor => {
                req.flash('success_msg', 'Статья добавленна!');
                res.redirect('/dashboard/investors');
            })
            .catch(err => console.log(err));
    }
});

router.post('/upload/:id', ensureAuthenticated, upload.single('Image'), (req, res) => {
    res.redirect('/dashboard/investors/edit/' + req.params.id);
});

router.post('/upload/', ensureAuthenticated, upload.single('Image'), (req, res) => {
    var urlImage = req.file.originalname;
    var img = req.file;
    res.render('investor-page-dashboard', { urlImage, img });
});

// DELETE Investor
router.get('/del/:id', ensureAuthenticated, (req, res) => {
    Investor.findOneAndRemove({ _id: req.params.id })
        .then(investor => {
            req.flash('success_msg', 'Статья удалена!');
            res.redirect('/dashboard/investors');
        })
        .catch(err => console.log(err));
});

module.exports = router;