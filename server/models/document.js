const mongoose = require('mongoose');

const documentSchema = mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    url: { type: String, required: true },
    children: [{
        id: { type: String },
        name: { type: String },
        url: { type: String },
        description: { type: String }
    }]
});

module.exports = mongoose.model('Document', documentSchema);


