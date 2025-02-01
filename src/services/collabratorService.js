const CollaborateRequest = require('../Models/collabrateRequest.model');
const Feed = require('../Models/feedModel.js');
const User = require('../Models/userModel.js');

// ✅ Send Collaboration Request
const sendCollaborationRequest = async (userId, feedId) => {
    try {
        // Check if feed exists
        const feed = await Feed.findById(feedId);
        if (!feed) throw new Error("Feed not found.");

        // Check if request already exists
        const existingRequest = await CollaborateRequest.findOne({ userId, feedId });
        if (existingRequest) throw new Error("Collaboration request already sent.");

        // Create new request
        const request = await CollaborateRequest.create({ userId, feedId });
        return { message: "Collaboration request sent successfully.", request };
    } catch (error) {
        throw new Error(error.message || "Failed to send collaboration request.");
    }
};

// ✅ Update Collaboration Request (Accept/Reject)
const updateCollaborationRequest = async (requestId, status) => {
    try {
        if (!['accepted', 'rejected'].includes(status)) throw new Error("Invalid status.");

        const request = await CollaborateRequest.findByIdAndUpdate(requestId, { status }, { new: true });
        if (!request) throw new Error("Collaboration request not found.");

        return { message: `Request ${status} successfully.`, request };
    } catch (error) {
        throw new Error(error.message || "Failed to update collaboration request.");
    }
};

// ✅ Cancel Collaboration Request (Delete Request)
const cancelCollaborationRequest = async (requestId, userId) => {
    try {
        const request = await CollaborateRequest.findOne({ _id: requestId, userId });
        if (!request) throw new Error("Request not found or unauthorized.");

        await request.deleteOne();
        return { message: "Collaboration request canceled successfully." };
    } catch (error) {
        throw new Error(error.message || "Failed to cancel collaboration request.");
    }
};

// ✅ Get All Collaboration Requests for a Feed
const getCollaborationRequestsByFeed = async (feedId) => {
    try {
        const requests = await CollaborateRequest.find({ feedId }).populate('userId', 'name email');
        return requests;
    } catch (error) {
        throw new Error("Failed to fetch collaboration requests.");
    }
};

// ✅ Get User's Collaboration Requests
const getUserCollaborationRequests = async (userId) => {
    try {
        const requests = await CollaborateRequest.find({ userId }).populate('feedId');
        return requests;
    } catch (error) {
        throw new Error("Failed to fetch user's collaboration requests.");
    }
};

module.exports = {
    sendCollaborationRequest,
    updateCollaborationRequest,
    cancelCollaborationRequest,
    getCollaborationRequestsByFeed,
    getUserCollaborationRequests
};
