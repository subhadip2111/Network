const { createFeedValidation } = require('../validation/feedValidation');
const { createFeed, getFeedById, getFeeds, updateFeed, deleteFeed, uploadFeedImage } = require('../services/feedService');
const ApiSuccess = require('../Utils/ApiSuccess');
const ApiError = require('../Utils/ApiError');
const { findUserDetails } = require('../services/userService');
const logger = require('../Utils/logger');
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Set the uploads directory
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    // Define a unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

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
        message: 'Opps Something went wrong!',
    })
  }
};

const upload = multer({ storage }).single('image');

const uploadFeedImageController = async (req, res) => {
  logger.info('uploadFeedImage api called');
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: 'Error uploading file', error: err.message });
      }

      const { postId } = req.params;

      if (!postId) {
        return res.status(400).json({ message: 'feedId is required' });
      }

      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const filePath = path.resolve(req.file.path);

      const updatedFeed = await uploadFeedImage(postId, filePath);

      return res.status(200).json({ message: 'Feeds Image updated successfully', feed: updatedFeed });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
        success: false,
        message: 'Opps Something went wrong!',
    })  }
};

const getfeedsBasedOnUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const getUserDetails = await findUserDetails(userId);

    let { profileType, interest, jobPreferences, activityStatus } = getUserDetails;
    let page = req.query.page || 1;
    let pageSize = req.query.pageSize || 10;
    const feeds = await getFeeds(profileType, interest, jobPreferences, activityStatus, page, pageSize, req.query.keyword);
    if (feeds.length == 0) {
      return res.status(404).json({
        success: false,
        message: 'Opps Something went wrong!',
      });
    }
    console.log('feeds', feeds);
    return res.status(200).send({
      success: true,
      message: 'Feeds fetched successfully',
      data: feeds,
    });
  } catch (error) {
    return res.status(500).json({
        success: false,
        message: 'Opps Something went wrong!',
    })  }
};
const getfeddDetailsById = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await getFeedById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    return res.status(200).json({ message: 'Post found successfully', post });
  } catch (error) {
    return res.status(500).json({
        success: false,
        message: 'Opps Something went wrong!',
    })  }
};
const editFeedPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await getFeedById(postId);
    if (!post) {
        return res.status(404).json({ message: 'Post not found' });
    }
    const updatedPost = await updateFeed(postId, req.body);
    return res.status(200).json({ message: 'Post updated successfully', updatedPost });
  } catch (error) {
    return res.status(500).json({
        success: false,
        message: 'Opps Something went wrong!',
    })
  }
};
const deleteFeedPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await getFeedById(postId);
    if (!post) {
        return res.status(404).json({ message: 'Post not found' }); 
    }
    const deletedPost = await deleteFeed(postId);
    return res.status(200).json({ message: 'Post deleted successfully', deletedPost });
  } catch (error) {
    return res.status(500).json({
        success: false,
        message: 'Opps Something went wrong!',
    })  }
};

module.exports = {
  createFeedPost,
  getfeedsBasedOnUserProfile,
  getfeddDetailsById,
  editFeedPost,
  deleteFeedPost,
  uploadFeedImageController,
};
