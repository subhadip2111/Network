const SaveFeedModel = require('../Models/saveFeedModel.js');
const FeedModel = require('../Models/feedModel.js');

const saveFeed = async (feedId, userId) => {
  try {
    const existingFeed = await SaveFeedModel.findOne({ feedId, userId });
    if (existingFeed) {
      throw new Error("Feed already saved.");
    }

    // Save the feed
    const savedFeed = await SaveFeedModel.create({ feedId, userId });

    // Populate feed details
    const populatedFeed = await SaveFeedModel.findById(savedFeed._id)
      .populate({
        path: 'feedId',
        populate: { path: 'createdBy', select: 'name email' },
      })
      .populate({ path: 'userId', select: 'name email' });

    return populatedFeed;
  } catch (error) {
    console.error("❌ Error saving feed:", error.message);
    throw new Error(error.message || "Failed to save feed.");
  }
};

// ✅ View All Saved Feeds for a User
const viewAllSavedFeeds = async (userId) => {
  try {
    const savedFeedList = await SaveFeedModel.find({ userId })
      .populate({
        path: 'feedId',
        populate: { path: 'createdBy', select: 'name email' },
      });

    if (!savedFeedList.length) {
      throw new Error("No saved feeds found.");
    }

    return savedFeedList;
  } catch (error) {
    console.error("❌ Error fetching saved feeds:", error.message);
    throw new Error(error.message || "Failed to fetch saved feeds.");
  }
};

// ✅ Remove a Feed from Saved List
const removeFeedFromSave = async (userId, feedId) => {
  try {
    const feed = await SaveFeedModel.findOneAndDelete({ userId, feedId });

    if (!feed) {
      throw new Error("Feed not found in saved list.");
    }

    return { message: "Feed removed successfully." };
  } catch (error) {
    console.error("❌ Error removing saved feed:", error.message);
    throw new Error(error.message || "Failed to remove feed.");
  }
};

module.exports = {
  saveFeed,
  viewAllSavedFeeds,
  removeFeedFromSave
};
