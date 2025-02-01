const Community = require('../Models/communityModel.js');
const User = require('../Models/userModel.js');

// ✅ Create a Community
const createCommunity = async (name, description, adminId) => {
  try {
    // Check if community name already exists
    const existingCommunity = await Community.findOne({ name });
    if (existingCommunity) {
      throw new Error('Community name already exists.');
    }

    const community = await Community.create({
      name,
      description,
      admin: adminId,
      members: [adminId], // Admin is the first member
    });

    return community;
  } catch (error) {
    console.error('❌ Error creating community:', error.message);
    throw new Error(error.message || 'Failed to create community.');
  }
};

// ✅ Join a Community
const joinCommunity = async (userId, communityId) => {
  try {
    const community = await Community.findById(communityId);
    if (!community) throw new Error('Community not found.');

    if (community.members.includes(userId)) {
      throw new Error('User is already a member.');
    }

    community.members.push(userId);
    await community.save();

    return { message: 'Joined the community successfully.' };
  } catch (error) {
    console.error('❌ Error joining community:', error.message);
    throw new Error(error.message || 'Failed to join community.');
  }
};

// ✅ Add People to a Community (Admin Only)
const addMemberToCommunity = async (adminId, communityId, userId) => {
  try {
    const community = await Community.findById(communityId);
    if (!community) throw new Error('Community not found.');

    if (community.admin.toString() !== adminId) {
      throw new Error('Only the admin can add members.');
    }

    if (community.members.includes(userId)) {
      throw new Error('User is already in the community.');
    }

    community.members.push(userId);
    await community.save();

    return { message: 'User added to community.' };
  } catch (error) {
    console.error('❌ Error adding member:', error.message);
    throw new Error(error.message || 'Failed to add member.');
  }
};


// ✅ Remove People from Community (Admin Only)
const removeMemberFromCommunity = async (adminId, communityId, userId) => {
  try {
    const community = await Community.findById(communityId);
    if (!community) throw new Error('Community not found.');

    if (community.admin.toString() !== adminId) {
      throw new Error('Only the admin can remove members.');
    }

    if (!community.members.includes(userId)) {
      throw new Error('User is not in the community.');
    }

    community.members = community.members.filter(member => member.toString() !== userId);
    await community.save();

    return { message: 'User removed from community.' };
  } catch (error) {
    console.error('❌ Error removing member:', error.message);
    throw new Error(error.message || 'Failed to remove member.');
  }
};

// ✅ View All Communities
const getAllCommunities = async () => {
  try {
    const communities = await Community.find().populate('admin', 'name email');
    return communities;
  } catch (error) {
    console.error('❌ Error fetching communities:', error.message);
    throw new Error('Failed to fetch communities.');
  }
};

// ✅ View Members in a Community
const getCommunityMembers = async (communityId) => {
  try {
    const community = await Community.findById(communityId).populate('members', 'name email');
    if (!community) throw new Error('Community not found.');

    return community.members;
  } catch (error) {
    console.error('❌ Error fetching members:', error.message);
    throw new Error('Failed to fetch members.');
  }
};

// ✅ Leave a Community
const leaveCommunity = async (userId, communityId) => {
  try {
    const community = await Community.findById(communityId);
    if (!community) throw new Error('Community not found.');

    if (!community.members.includes(userId)) {
      throw new Error('User is not a member.');
    }

    // Prevent admin from leaving unless another admin is assigned
    if (community.admin.toString() === userId) {
      throw new Error('Admin cannot leave the community.');
    }

    community.members = community.members.filter(member => member.toString() !== userId);
    await community.save();

    return { message: 'Successfully left the community.' };
  } catch (error) {
    console.error('❌ Error leaving community:', error.message);
    throw new Error(error.message || 'Failed to leave community.');
  }
};

module.exports = {
  createCommunity,
  joinCommunity,
  addMemberToCommunity,
  removeMemberFromCommunity,
  getAllCommunities,
  getCommunityMembers,
  leaveCommunity,
};
