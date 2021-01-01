const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const collectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter a collection name'],
    },
    userId: {
        type: ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true,
})

collectionSchema.index({'name': 1, 'userId': 1}, { unique: true});

const Collection = mongoose.model('Collection', collectionSchema);

module.exports = Collection;