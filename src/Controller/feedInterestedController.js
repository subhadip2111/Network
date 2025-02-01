const {
  createFeedInterested,
  getFeedInterestedById,
  addUserToFeed,
  removeUserFromFeed,
  deleteFeedInterested,
  getAllsaveFeeds,
} = require('../services/feedInterestedService');

const addFeedAsInterested = async (req, res) => {
  try {
    const result = await createFeedInterested(req.body);

    return res.status(201).json({
      success: true,
      message: 'Feed added as interested',
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error adding feed as interested',
      data: error.message,
    });
  }
};

const getAllSaveFeed = async (req, res) => {
    console.log(req.user.userId)
  try {
    const result = await getAllsaveFeeds(req.user.userId);
    return res.status(200).json({
      success: true,
      message: 'Saved feeds get successfully',
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error adding feed as interested',
      data: error.message,
    });
  }
};

const viewSaveFeedById = async (req, res) => {
  try {
    const saveFeedId = req.params.saveFeedId;
    const result = await getFeedInterestedById(saveFeedId);
    return res.status(200).json({
      success: true,
      message: 'Feed viewed successfully',
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error adding feed as interested',
      data: error.message,
    });
  }
};

const deletedFeedFromSaved = async (req, res) => {
  try {
    const saveFeedId = await deleteFeedInterested(req.params.saveFeedId);
    return res.status(200).json({
      success: true,
      message: 'Feed deleted successfully',
      data: saveFeedId,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error adding feed as interested',
      data: error.message,
    });
  }
};

module.exports = { addFeedAsInterested, getAllSaveFeed, viewSaveFeedById ,deletedFeedFromSaved};
