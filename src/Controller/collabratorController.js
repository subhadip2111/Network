

const { sendCollaborationRequest,
    updateCollaborationRequest,
    cancelCollaborationRequest,
    getCollaborationRequestsByFeed,
    getUserCollaborationRequests} =require('../services/collabratorService.js')


// ✅ Send Collaboration Request
const   sendCollaborationRequestController = async (req, res) => {
    try {
        const { userId, feedId } = req.body;
        const response = await sendCollaborationRequest(userId, feedId);
        return res.status(201).json(response);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

// ✅ Accept/Reject Collaboration Request
const updateCollaborationRequestController = async (req, res) => {
    try {
        const { requestId, status } = req.body;
        const response = await updateCollaborationRequest(requestId, status);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

// ✅ Cancel Collaboration Request
const cancelCollaborationRequestController= async (req, res) => {
    try {
        const { requestId, userId } = req.body;
        const response = await cancelCollaborationRequest(requestId, userId);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

// ✅ Get All Requests for a Feed
const getCollaborationRequestsByFeedController = async (req, res) => {
    try {
        const { feedId } = req.params;
        const requests = await getCollaborationRequestsByFeed(feedId);
        return res.status(200).json(requests);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

// ✅ Get User Collaboration Requests
const getUserCollaborationRequestsController = async (req, res) => {
    try {
        const { userId } = req.params;
        const requests = await getUserCollaborationRequests(userId);
        return res.status(200).json(requests);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

module.exports = {
    sendCollaborationRequestController,
    updateCollaborationRequestController,
    cancelCollaborationRequestController,
    getCollaborationRequestsByFeedController,
    getUserCollaborationRequestsController
};
