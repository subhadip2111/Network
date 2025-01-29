const mongoose = require('mongoose');

const saveFeedSchema = new mongoose.Schema({
    feedId: {  // Renamed from fedeId to feedId
        type: mongoose.Schema.Types.ObjectId,
        ref: "Feed",  // Assuming Feed collection exists
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",  
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

saveFeedSchema.index({ userId: 1, feedId: 1 }, { unique: true });

const SaveFeed = mongoose.model('SaveFeed', saveFeedSchema);

module.exports = SaveFeed;
