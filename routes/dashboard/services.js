const express = require('express');
const multer  = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './assets/img/services')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
});

const upload  = multer({ storage: storage });

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

// Render service Edit Page
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Service.findById({ _id: req.params.id })
        .then(service => {
            heading = service.heading;
            description = service.description;
            shortDescription = service.shortDescription;
            imagesForDescription = service.imagesForDescription;
            imgUrl = service.imgUrl;
            res.render('service-page-dashboard', { heading, description, shortDescription, imagesForDescription, imgUrl });
        })
        .catch(err => {
            console.log(err)
        });
});

// Edit service Handle
router.post('/edit/:id', ensureAuthenticated, upload.single('imgUrl'), (req, res) => {
    const { 
        heading, 
        description, 
        shortDescription,
        imagesForDescription 
    } = req.body;
    const imgUrl = "http://localhost/assets/img/services/" + req.file.originalname;

    let errors = [];

    // Check required fields
    if (!heading || !shortDescription) {
        errors.push({ msg: 'Заполните обязательные поля (*)' });
    }

    if (errors.length > 0) {
        res.render('service-page-dashboard', { 
            errors, 
            heading, 
            description, 
            shortDescription,
            imagesForDescription,
            imgUrl
        });
    } else {

        Service.findByIdAndUpdate(
            { _id: req.params.id }, 
            { 
                heading: heading,
                description: description, 
                shortDescription: shortDescription, 
                imgUrl: imgUrl, 
                imagesForDescription: imagesForDescription } )
        .then(services => {
            req.flash('success_msg', 'Статья обновлена!');
            res.redirect('/dashboard/services');
        })
        .catch(err => console.log(err));
    }

    
});

// Render New service Page
router.get('/add', ensureAuthenticated, (req, res) => {
    urlImage = '/assets/img/noimage.png'
    res.render('service-page-dashboard', { urlImage });
});

// Add New service Handle
router.post('/add', ensureAuthenticated, upload.single('imgUrl'), (req, res) => {
    const { 
        heading, 
        description, 
        shortDescription,
        imagesForDescription 
    } = req.body;
    const imgUrl = "http://localhost/assets/img/services/" + req.file.originalname;
    let errors = [];

    // Check required fields
    if (!heading || !shortDescription) {
        errors.push({ msg: 'Заполните обязательные поля (*)' });
    }

    if (errors.length > 0) {
        res.render('service-page-dashboard', { errors, heading, description, shortDescription });
    } else {
        const newService = new Service ({
            heading, 
            description, 
            shortDescription, 
            imgUrl,
            imagesForDescription
        });
    
        newService.save()
            .then(service => {
                req.flash('success_msg', 'Статья добавленна!');
                res.redirect('/dashboard/services');
            })
            .catch(err => console.log(err));
    }
});

// DELETE service
router.get('/del/:id', ensureAuthenticated, (req, res) => {
    Service.findOneAndRemove({ _id: req.params.id })
        .then(service => {
            req.flash('success_msg', 'Статья удалена!');
            res.redirect('/dashboard/services');
        })
        .catch(err => console.log(err));
});

module.exports = router;