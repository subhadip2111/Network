const communityService = require('../services/communityService');

// ✅ Create a Community
const createCommunity = async (req, res) => {
  try {
    const { name, description, adminId } = req.body;
    const response = await communityService.createCommunity(name, description, adminId);
    return res.status(201).json(response);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// ✅ Join a Community
const joinCommunity = async (req, res) => {
  try {
    const { communityId, userId } = req.body;
    const response = await communityService.joinCommunity(communityId, userId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// ✅ Add Member to a Community
const addMemberToCommunity = async (req, res) => {
  try {
    const { adminId, communityId, userId } = req.body;
    const response = await communityService.addMemberToCommunity(adminId, communityId, userId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// ✅ Remove Member from a Community
const removeMemberFromCommunity = async (req, res) => {
  try {
    const { adminId, communityId, userId } = req.body;
    const response = await communityService.removeMemberFromCommunity(adminId, communityId, userId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// ✅ Get Community Details
const getCommunityDetails = async (req, res) => {
  try {
    const community = await communityService.getCommunityDetails(req.params.communityId);
    return res.status(200).json(community);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createCommunity,
  joinCommunity,
  addMemberToCommunity,
  removeMemberFromCommunity,
  getCommunityDetails,
};
