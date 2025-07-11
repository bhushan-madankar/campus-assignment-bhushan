const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    resourceType: {
        type: String,
        enum: ['book', 'video', 'article'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Resource = mongoose.model('Resource', schema);

module.exports = Resource;