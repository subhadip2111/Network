const User = require('../Models/userModel.js');

// ✅ Follow a User
const followUser = async (userId, targetUserId) => {
  try {
    if (userId === targetUserId) throw new Error("You can't follow yourself.");

    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!user || !targetUser) throw new Error("User not found.");

    if (user.following.includes(targetUserId)) {
      throw new Error("You are already following this user.");
    }

    user.following.push(targetUserId);
    targetUser.followers.push(userId);

    await user.save();
    await targetUser.save();

    return { message: 'Successfully followed the user.' };
  } catch (error) {
    throw new Error(error.message || 'Failed to follow user.');
  }
};

// ✅ Unfollow a User
const unfollowUser = async (userId, targetUserId) => {
  try {
    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!user || !targetUser) throw new Error("User not found.");

    if (!user.following.includes(targetUserId)) {
      throw new Error("You are not following this user.");
    }

    user.following = user.following.filter(id => id.toString() !== targetUserId);
    targetUser.followers = targetUser.followers.filter(id => id.toString() !== userId);

    await user.save();
    await targetUser.save();

    return { message: 'Successfully unfollowed the user.' };
  } catch (error) {
    throw new Error(error.message || 'Failed to unfollow user.');
  }
};

// ✅ Get User's Followers
const getFollowers = async (userId) => {
  try {
    const user = await User.findById(userId).populate('followers', 'name email');
    if (!user) throw new Error("User not found.");
    return user.followers;
  } catch (error) {
    throw new Error('Failed to fetch followers.');
  }
};

// ✅ Get Users a User is Following
const getFollowing = async (userId) => {
  try {
    const user = await User.findById(userId).populate('following', 'name email');
    if (!user) throw new Error("User not found.");
    return user.following;
  } catch (error) {
    throw new Error('Failed to fetch following list.');
  }
};

// ✅ Check if User1 follows User2
const isFollowing = async (userId, targetUserId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found.");
    return user.following.includes(targetUserId);
  } catch (error) {
    throw new Error('Failed to check follow status.');
  }
};

module.exports = {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  isFollowing,
};
