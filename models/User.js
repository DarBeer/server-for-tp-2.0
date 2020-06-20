const mongoose = require('mongoose');

const UserSchema = mongoose.Schema;

const User = new UserSchema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { collection: 'users' });

module.exports = mongoose.model('User', User);