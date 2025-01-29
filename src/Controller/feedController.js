const { createFeedValidation } = require('../validation/feedValidation');
const { createFeed, getFeedById, getFeeds, updateFeed, deleteFeed } = require('../services/feedService');
const ApiSuccess = require('../Utils/ApiSuccess');
const ApiError = require('../Utils/ApiError');
const { findUserDetails } = require('../services/userService');
const logger = require('../Utils/logger');

const createFeedPost = async (req, res) => {
    logger.info('createPost API called');
    try {
      const userId = req.user.userId;
  
      // Validate the input data
      const { error } = createFeedValidation(req.body);
      if (error) {
        console.log(error.details[0].message);
        return res.status(400).json({ error: error.details[0].message });
      }
  
      // Assign the userId to the createdBy field
      req.body.createdBy = userId;
      console.log(req.body);
  
      // Create the feed (or post)
      const post = await createFeed(req.body);
      console.log(post);
  
      return res.status(201).json({
        success: true,
        message: 'Post created successfully',
        data: post,
      });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  };
  
const getfeedsBasedOnUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const getUserDetails = await findUserDetails(userId);
   
    let { profileType, interest, jobPreferences ,activityStatus} = getUserDetails;
    let page = req.query.page || 1;
    let pageSize = req.query.pageSize || 10;
    const feeds = await getFeeds(profileType, interest, jobPreferences, activityStatus, page, pageSize,req.query.keyword);
    if(feeds.length ==0){
        return res.status(404).json({
            success: false,
            message: 'Opps Something went wrong!',
        })
    }
    console.log("feeds",feeds)
    return res.status(200).send({
        success: true,
        message: 'Feeds fetched successfully',
        data: feeds,
    })
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};
const getfeddDetailsById = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await getFeedById(postId);
    if (!post) {
      throw new ApiError(404, 'Post not found');
    }
    return new ApiSuccess(200, 'Post fetched successfully', post);
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};
const editFeedPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await getFeedById(postId);
    if (!post) {
      throw new ApiError(404, 'Post not found');
    }
    const updatedPost = await updateFeed(postId, req.body);
    return new ApiSuccess(200, 'Post updated successfully', updatedPost);
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};
const deleteFeedPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await getFeedById(postId);
    if (!post) {
      throw new ApiError(404, 'Post not found');
    }
    const deletedPost = await deleteFeed(postId);
    return new ApiSuccess(200, 'Post deleted successfully', deletedPost);
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};

module.exports = { createFeedPost, getfeedsBasedOnUserProfile, getfeddDetailsById, editFeedPost, deleteFeedPost };
