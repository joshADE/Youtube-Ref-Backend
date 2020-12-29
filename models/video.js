const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const videoSchema = new Schema({
    username: { type: String, required: true },
    startSeconds: { type: Number, required: true },
    endSeconds: { type: Number },
    url: { type: String, required: true },
    name: { type: String, required: true }
}, {
    timestamps: true,
})

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;