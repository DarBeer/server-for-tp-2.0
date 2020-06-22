const mongoose = require('mongoose');

const InvestorSchema = mongoose.Schema;

const Investor = new InvestorSchema({
    name: String,
    urlImage: String,
    urlToInv: String,
    visible: Boolean
},{
    collection: 'investors'
});

module.exports = mongoose.model('Investor', Investor);