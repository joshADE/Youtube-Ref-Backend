const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ObjectId = mongoose.Schema.Types.ObjectId;

const videoSchema = new Schema({
    userId: { type: ObjectId, required: true, ref: 'User' },
    collectionId: { type: ObjectId, ref: 'Collection', default: null},
    startSeconds: { type: Number, required: true },
    endSeconds: { type: Number, default: null },
    url: { type: String, required: true },
    name: { type: String, required: true }
}, {
    timestamps: true,
})

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;