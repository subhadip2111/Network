const mongoose = require('mongoose');

const saveFeedSchema = new mongoose.Schema({
    feedId: {  
        type: mongoose.Schema.Types.ObjectId,
        ref: "Feeds",  
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

const SaveFeedModel = mongoose.model('SaveFeed', saveFeedSchema);

module.exports = SaveFeedModel;
