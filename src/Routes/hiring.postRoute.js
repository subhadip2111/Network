const express = require('express');
const { createPost } = require('../Controller/hiringPostController');
const { authentication } = require('../Middleware/auth');
const hiringComoanyRouter = express.Router();


hiringComoanyRouter.post('/company/addpost',authentication,createPost);
module.exports = hiringComoanyRouter;