const mongoose = require('mongoose');

const ServiceSchema = mongoose.Schema;

const Service = new ServiceSchema({
    imgUrl: String,
    heading: String,
    shortDescription: String,
    description: String,
    visible: Boolean,
    imgDescription: [{
        imgUrl: String
    }]
},{
    collection: 'services'
});

module.exports = mongoose.model('Service', Service);