const express = require('express');
const { addFeedAsInterested, getAllSaveFeed, viewSaveFeedById ,deletedFeedFromSaved } = require('../Controller/feedInterestedController');
const { authentication } = require('../Middleware/auth');
const feedInterestedRoute = express.Router();

feedInterestedRoute.post('/add/interest',addFeedAsInterested );
feedInterestedRoute.get('/get/interest',authentication,getAllSaveFeed);
feedInterestedRoute.get('/view/:saveFeedId',viewSaveFeedById);
feedInterestedRoute.delete('/delete/:saveFeedId',deletedFeedFromSaved);
module.exports=feedInterestedRoute;