const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const feedInterestedSchema = new Schema({
    feedId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Feeds',
        required: true
    },
    userIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

const FeedInterested = mongoose.model('FeedInterested', feedInterestedSchema);

module.exports = FeedInterested;