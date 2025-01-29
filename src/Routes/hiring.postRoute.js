const express = require('express');
const { createPost,viewAllPosts, viewPost, editPost, deletePost } = require('../Controller/hiringPostController');
const { authentication } = require('../Middleware/auth');
const hiringComoanyRouter = express.Router();


hiringComoanyRouter.post('/company/addpost',authentication,createPost);
hiringComoanyRouter.get('/company/viewpost',authentication,viewAllPosts);
hiringComoanyRouter.get('/company/viewpost/:postId',authentication,viewPost);
hiringComoanyRouter.patch('/company/editpost/:postId',authentication,editPost);
hiringComoanyRouter.delete('/company/deletepost/:postId',authentication,deletePost);

module.exports = hiringComoanyRouter;