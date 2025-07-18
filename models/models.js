// model.js (assuming in root or models dir)
const mongoose = require('mongoose');

const imgSchema = new mongoose.Schema({
    name: String,
    desc: String,
    img: {
        data: Buffer,
        contentType: String
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // <-- associate image with user
});

module.exports = mongoose.model('Image', imgSchema);
