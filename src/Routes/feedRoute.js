const express = require('express');
const feedRouter = express.Router();
const { authentication } = require('../Middleware/auth');
const {createFeedPost,getfeedsBasedOnUserProfile,getfeddDetailsById,editFeedPost,deleteFeedPost}= require('../Controller/feedController');
// define all routes for the feed or post .it can be by any user  or by admin .like platform owner.
feedRouter.post('/post/create', authentication, createFeedPost);
feedRouter.get('/post/all', authentication,getfeedsBasedOnUserProfile);
feedRouter.get('/post/:postId', getfeddDetailsById);
feedRouter.patch('/post/edit/:postId', authentication, editFeedPost);
feedRouter.delete('/post/delete/:postId', authentication, deleteFeedPost);
module.exports = feedRouter; // export the router so it can be used in other files.
