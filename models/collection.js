const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const collectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter a collection name'],
    },
    color: {
        type: String,
        default: '#000000'
    },
    userId: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    videos: [{ type: ObjectId, ref: 'Video' }]
}, {
    timestamps: true,
})

collectionSchema.index({'name': 1, 'userId': 1}, { unique: true});

const Collection = mongoose.model('Collection', collectionSchema);

module.exports = Collection;