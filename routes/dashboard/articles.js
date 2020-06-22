const express = require('express');
const multer  = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './assets/img/articles')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
});

const upload  = multer({ storage: storage });

const { ensureAuthenticated } = require('../../config/auth');

// Aricles model
const Article = require('../../models/Article');

const router = express.Router();

// Render Aricles Page
router.get('/', ensureAuthenticated, (req, res) => {
    Article.find().lean().sort({ date: -1 })
        .then(articles => {
            res.render('articles-dashboard', { articles });
        })
        .catch(err => {
            console.log(err);
            res.render('articles-dashboard');
        });
    
});

// Render Article Edit Page
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Article.findById({ _id: req.params.id })
        .then(article => {
            heading = article.heading;
            description = article.description;
            shortDescription = article.shortDescription;
            imagesForDescription = article.imagesForDescription;
            urlImage = article.urlImage;
            res.render('article-page-dashboard', { heading, description, shortDescription, imagesForDescription, urlImage });
        })
        .catch(err => {
            console.log(err)
        });
});

// Edit Article Handle
router.post('/edit/:id', ensureAuthenticated, upload.single('urlImage'), (req, res) => {
    const { 
        heading, 
        description, 
        shortDescription,
        imagesForDescription 
    } = req.body;
    if (req.file != 'undefined') {
        console.log(req.file);
        const urlImage = "http://localhost/assets/img/articles/" + req.file.originalname;
    }
    

    let errors = [];

    // Check required fields
    if (!heading || !shortDescription) {
        errors.push({ msg: 'Заполните обязательные поля (*)' });
    }

    if (errors.length > 0) {
        res.render('article-page-dashboard', { 
            errors, 
            heading, 
            description, 
            shortDescription,
            imagesForDescription,
            urlImage
        });
    } else {

        Article.findByIdAndUpdate(
            { _id: req.params.id }, 
            { 
                heading: heading,
                description: description, 
                shortDescription: shortDescription, 
                urlImage: urlImage, 
                imagesForDescription: imagesForDescription } )
        .then(article => {
            req.flash('success_msg', 'Статья обновлена!');
            res.redirect('/dashboard/articles');
        })
        .catch(err => console.log(err));
    }

    
});

// Render New Article Page
router.get('/add', ensureAuthenticated, (req, res) => {
    urlImage = '/assets/img/noimage.png'
    res.render('article-page-dashboard', { urlImage });
});

// Add New Article Handle
router.post('/add', ensureAuthenticated, upload.single('urlImage'), (req, res) => {
    const { 
        heading, 
        description, 
        shortDescription,
        imagesForDescription 
    } = req.body;
    if (!req.file == 'indefined') {
        const urlImage = "http://localhost/assets/img/articles/" + req.file.originalname;
    } else {
        const urlImage = "http://loclahost/assets/img/noimage.png"
    }
    let errors = [];

    // Check required fields
    if (!heading || !shortDescription) {
        errors.push({ msg: 'Заполните обязательные поля (*)' });
    }

    if (errors.length > 0) {
        res.render('article-page-dashboard', { errors, heading, description, shortDescription });
    } else {
        const newArticle = new Article ({
            heading, 
            description, 
            shortDescription, 
            urlImage,
            imagesForDescription
        });
    
        newArticle.save()
            .then(article => {
                req.flash('success_msg', 'Статья добавленна!');
                res.redirect('/dashboard/articles');
            })
            .catch(err => console.log(err));
    }
});

// DELETE article
router.get('/del/:id', ensureAuthenticated, (req, res) => {
    Article.findOneAndRemove({ _id: req.params.id })
        .then(article => {
            req.flash('success_msg', 'Статья удалена!');
            res.redirect('/dashboard/articles');
        })
        .catch(err => console.log(err));
});



module.exports = router;