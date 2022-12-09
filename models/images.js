const mongoose = require('mongoose');

const imageSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    exam_id:String,
    name: String,
    url: String,
    comment:String
});

module.exports = mongoose.model('images', imageSchema);