const FeedInterested = require('../Models/feedInterestedModel');
const mongoose = require('mongoose');

async function createFeedInterested(data) {
    try {
        if (!data.feedId || !mongoose.Types.ObjectId.isValid(data.feedId)) {
            throw new Error('Invalid feedId');
        }

        let feedInterested = await FeedInterested.findOne({ feedId: data.feedId });
        if (feedInterested) {
            if (feedInterested.userIds.includes(data.userId)) {
                throw new Error('User already exists in FeedInterested');
            } else {
                feedInterested.userIds.push(data.userId);
                return await feedInterested.save();
            }
        }

        feedInterested = new FeedInterested({
            feedId: data.feedId,
            userIds: [data.userId]
        });
        return await feedInterested.save();
    } catch (error) {
        throw new Error(`Error creating FeedInterested: ${error.message}`);
    }
}

async function getFeedInterestedById(id) {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid ID format');
        }

        const feedInterested = await FeedInterested.findById(id).populate('feedId');
        if (!feedInterested) {
            throw new Error('FeedInterested not found');
        }
        return feedInterested;
    } catch (error) {
        throw new Error(`Error fetching FeedInterested: ${error.message}`);
    }
}

async function addUserToFeed(feedId, userId) {
    try {
        if (!mongoose.Types.ObjectId.isValid(feedId) || !mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error('Invalid feedId or userId');
        }

        const feedInterested = await FeedInterested.findOneAndUpdate(
            { feedId },
            { $addToSet: { userIds: userId } },
            { new: true, upsert: true }
        ).populate('feedId userIds');
        return feedInterested;
    } catch (error) {
        throw new Error(`Error adding user to FeedInterested: ${error.message}`);
    }
}

async function removeUserFromFeed(feedId, userId) {
    try {
        if (!mongoose.Types.ObjectId.isValid(feedId) || !mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error('Invalid feedId or userId');
        }

        const feedInterested = await FeedInterested.findOneAndUpdate(
            { feedId },
            { $pull: { userIds: userId } },
            { new: true }
        ).populate('feedId userIds');

        if (!feedInterested) {
            throw new Error('FeedInterested entry not found');
        }

        return feedInterested;
    } catch (error) {
        throw new Error(`Error removing user from FeedInterested: ${error.message}`);
    }
}

async function deleteFeedInterested(id) {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid ID format');
        }

        const result = await FeedInterested.findByIdAndDelete(id);
        if (!result) {
            throw new Error('FeedInterested entry not found');
        }
        return { message: 'FeedInterested entry deleted successfully' };
    } catch (error) {
        throw new Error(`Error deleting FeedInterested: ${error.message}`);
    }
}

const getAllsaveFeeds=async(userId)=>{
    try {
        const result = await FeedInterested.find({
            userIds: { $in: [userId] },
        }).populate('feedId').sort({
            createdAt: -1,
        })
        console.log(result)
return result
    } catch (error) {
        
        throw new Error(`Error getting all save feeds: ${error.message}`);
    }
}

module.exports = {
    createFeedInterested,
    getFeedInterestedById,
    addUserToFeed,
    removeUserFromFeed,
    deleteFeedInterested,
    getAllsaveFeeds
};
