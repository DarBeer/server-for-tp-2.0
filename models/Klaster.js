const mongoose = require('mongoose');

const KlasterSchema = mongoose.Schema;

const Klaster = new KlasterSchema({
    name: String,
    description: String,
    date: String,
    visible: Boolean,
    imgDescription: [{
        imgUrl: String
    }]
},{
    collection: 'klasters'
});

module.exports = mongoose.model('Klaster', Klaster);