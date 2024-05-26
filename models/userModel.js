const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'banned'],
        default: 'active',
    },
});


const users = mongoose.model('users', userSchema);

module.exports = users;
