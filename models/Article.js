const mongoose = require('mongoose');

const ArticleSchema = mongoose.Schema;

const Article = new ArticleSchema({
    heading: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    shortDescription: {
        type: String,
        required: true
    },
    urlImage: {
        type: String
    },
    date: {
        type: String
    },
    visible: Boolean,
    imagesForDescription: [{
         urlImage: {
            type: String
         }
    }]
},{
    collection: 'articles'
});

module.exports = mongoose.model('Article', Article);