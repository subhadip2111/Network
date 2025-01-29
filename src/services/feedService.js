const FeedModel = require('../Models/feedModel');

const createFeed = async (feedBody) => {
  try {
    const feed = await FeedModel.create({ ...feedBody });
    return feed;
  } catch (error) {
    console.log("err from service",error);
    throw new Error(`Error creating feed: ${error.message}`);
  }
};

const getFeedById = async (id) => {
  try {
    const feed = await FeedModel.findById(id);
    return feed;
  } catch (error) {
    throw new Error(`Error fetching feed: ${error.message}`);
  }
};

// In my feed model i have define  tite ,description ,tags,targetProfileTypes .
//if I somehow match the tags with the interest and targetProfileTypes with profileType then i can get the feeds which are related to the user
// and also i can get the feeds which are related to the jobPreferences
// that is why i have to pass the interest,profileType,jobPreferences as a parameter in the getFeeds function
// now I am make a monodb aggregation query to get the feeds which are related to the user
const getFeeds = async (profileType, interest, jobPreferences, activityStatus, page, pageSize,keyword) => {
  try {
    page = Math.max(1, parseInt(page, 10) || 1);
    pageSize = Math.max(1, parseInt(pageSize, 10) || 10);
    const skip = (page - 1) * pageSize;

    const orConditions = [];

    if (interest && interest.length > 0) {
      orConditions.push({
        tags: { $regex: interest.join('|'), $options: 'i' }, 
      });
    }

    if (profileType) {
      orConditions.push({
        targetProfileTypes: { $regex: profileType, $options: 'i' }, 
      });
    }

    if (jobPreferences && jobPreferences.length > 0) {
      orConditions.push({
        tags: { $regex: jobPreferences.join('|'), $options: 'i' }, 
      });
    }

    if (activityStatus) {
      orConditions.push({
        activityStatus: { $regex: activityStatus, $options: 'i' },
      });
    }

    if (keyword) {
        orConditions.push(
          {
            title: { $regex: keyword, $options: 'i' }, 
          },
          {
            description: { $regex: keyword, $options: 'i' }, 
          },
          {
            tags: { $regex: keyword, $options: 'i' }, 
          }
        );
      }
    const feeds = await FeedModel.aggregate([
      {
        $match: {
          $or: orConditions,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $skip: skip,
      },
      {
        $limit: pageSize,
      },
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'createdBy',
        },
      },
      {
        $unwind: {
          path: '$createdBy', 
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          title: 1,
          description: 1,
          tags: 1,
          targetProfileTypes: 1,
          user: 1,
          createdBy: { name: 1, email: 1 },
          createdAt: 1,
        },
      },
    ])
    return feeds;
  } catch (error) {
    console.log("errr",error)

    throw new Error(`Error fetching feeds: ${error.message}`);
  }
};

const updateFeed = async (id, feedBody) => {
  try {
    const updatedFeed = await FeedModel.findByIdAndUpdate(id, feedBody, { new: true });
    if (!updatedFeed) {
      throw new Error(`Feed not found with id: ${id}`);
    }
    return updatedFeed;
  } catch (error) {
    throw new Error(`Error updating feed: ${error.message}`);
  }
};

const deleteFeed = async (id) => {
  try {
    const deletedFeed = await FeedModel.findByIdAndDelete(id);
    if (!deletedFeed) {
      throw new Error(`Feed not found with id: ${id}`);
    }
    return deletedFeed;
  } catch (error) {
    throw new Error(`Error deleting feed: ${error.message}`);
  }
};

module.exports = { createFeed, getFeedById, getFeeds, updateFeed, deleteFeed };
