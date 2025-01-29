const Token = require('../Models/token.model');
const userModels = require('../Models/userModel');
const ApiError = require('../Utils/ApiError');
const cloudinary = require('../Utils/cloudinaryConfig');

const login = async (email, otp) => {
  try {
    // Check if the user exists
    let user = await userModels.findOne({ email: email });
    if (user) {
      user.otp = otp;
      await user.save();
      return user;
    } else {
      const newUser = await userModels.create({ email, otp });
      return newUser;
    }
  } catch (err) {
    console.error('Error in saving OTP:', err.message);
    throw new Error('Failed to process login');
  }
};
const findUserByMobile = async (mobile, otp) => {
  try {
    const user = await userModels.findOne({ mobile: mobile });
    return user;
  } catch (error) {
    console.error('Error in verifying OTP:', error.message);
    return new ApiError(500, 'Failed to verify OTP');
  }
};


const findUserByemail = async (email) => {
  try {
    const user = await userModels.findOne({ email: email});
    return user;
  } catch (error) {
    console.error('Error in finding user by email:', error.message);
    return new ApiError(500, 'Failed to verify OTP');
  }
};

const otpVerify = async (email) => {
  try {
    let user = await userModels.findOne({ email: email });
    user.otp = '';
    await user.save();

    return user;
  } catch (error) {
    console.error('Error in verifying OTP:', error.message);
    return new ApiError(500, 'Failed to verify OTP');
  }
};

const updateUserData = async (userId, data) => {
  try {
    const user = await userModels.findById(userId);
    const updateData = Object.assign(user, data);
    await updateData.save();
    return updateData;
  } catch (error) {
    console.error('Error in updating user data:', error.message);
    throw new Error('Failed to update user data');
  }
};

const uploadProfileImage = async (userId, filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'profile_images',
    });

    const imageUrl = result.secure_url;
    const updatedUser = await userModels.findByIdAndUpdate(userId, { profileImage: imageUrl }, { new: true });

    return updatedUser;
  } catch (error) {
    throw new Error(`Error uploading image: ${error.message}`);
  }
};

const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.remove();
};

const   findUserDetails = async (userId) => {
  try {
    const user = await userModels.findById(userId);
    return user;
  } catch (error) {
    throw new Error(`Error to fetch userDetails: ${error.message}`);
  }
};



async function findUsersForHiringPost(postTitle, postDescription) {
  try {
    const searchKeywords = [...postTitle.split(' '), ...postDescription.split(' ')];
    const regexPattern = searchKeywords.map(keyword => `(?i)${keyword}`).join('|');

    const pipeline = [
      {
        $match: {
          $and: [
            {
              $or: [
                { skills: { $exists: true, $not: { $size: 0 } } },
                { jobPreferences: { $exists: true, $not: { $size: 0 } } },
                { projects: { $exists: true, $not: { $size: 0 } } },
              ],
            },
            { email: { $exists: true, $ne: '' } },
            { activityStatus: { $ne: 'employed' } },
          ],
        },
      },
      {
        $match: {
          $or: [
            { skills: { $regex: regexPattern, $options: 'i' } },
            { jobPreferences: { $regex: regexPattern, $options: 'i' } },
          ],
        },
      },
      {
        $addFields: {
          experienceMatch: {
            $regexMatch: {
              input: { $ifNull: ['$experience', ''] },
              regex: regexPattern,
              options: 'i',
            },
          },
        },
      },
      {
        $match: {
          $or: [
            { experienceMatch: true },
            { experience: { $exists: false } },
          ],
        },
      },
      {
        $project: {
          email: 1,
        },
      },
    ];

    const userList = await userModels.aggregate(pipeline);

    return userList;
  } catch (error) {
    console.error('Error finding users for the hiring post:', error);
    throw new Error('Error finding users');
  }
}



module.exports = {
  login,
  updateUserData,
  uploadProfileImage,
  findUserByMobile,
  otpVerify,
  logout,
  findUserDetails,
  findUsersForHiringPost,
  findUserByemail
};
