const express = require('express');
const collabratorRoute = express.Router();

const {
  sendCollaborationRequestController,
  updateCollaborationRequestController,
  cancelCollaborationRequestController,
  getCollaborationRequestsByFeedController,
  getUserCollaborationRequestsController,
} = require('../Controller/collabratorController.js');

const { authentication } = require('../Middleware/auth');

// ✅ Send Collaboration Request
collabratorRoute.post('/send/colabraterequest', authentication, sendCollaborationRequestController);

// ✅ Accept/Reject Collaboration Request
collabratorRoute.patch('/update/colabraterequest', authentication, updateCollaborationRequestController);

// ✅ Cancel Collaboration Request
collabratorRoute.delete('/cancel/colabraterequest', authentication, cancelCollaborationRequestController);

// ✅ Get All Collaboration Requests for a Feed
collabratorRoute.get('/feed/:feedId', authentication, getCollaborationRequestsByFeedController);

// ✅ Get User's Collaboration Requests
collabratorRoute.get('/user/:userId', authentication, getUserCollaborationRequestsController);

module.exports = collabratorRoute;
