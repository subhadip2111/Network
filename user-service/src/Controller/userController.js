const {
  login,
  updateUserData,
  uploadProfileImage,
  verifyUserOtp,
  otpVerify,
  findUserByMobile,
  findUserDetails,
  logout,
} = require('../services/userService');
const ApiError = require('../Utils/ApiError');
const ApiSuccess = require('../Utils/ApiSuccess');
const logger = require('../Utils/logger');
const { generateAuthTokens } = require('../Utils/tokenService');
const { sendOtpToClient } = require('../Utils/twillo.config');
const { loginValidation } = require('../Utils/validation');
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Set the uploads directory
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    // Define a unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});
// user login via otp
const loginUser = async (req, res) => {
  logger.info('loginUser api called');
  try {
    const { mobile } = req.body;

    const otp = await sendOtpToClient(mobile);
    const user = await login(mobile, otp);
    return res.status(200).json({ success: true, message: `Otp successFully send to this ${mobile} ` });
    // return res.status(200).json({ data: user, accessToken: tokens.access.token, refreshToken: tokens.refresh.token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const verifyOtp = async (req, res) => {
  logger.info('verifyOtp api called');
  try {
    const { mobile, otp } = req.body;

    const user = await findUserByMobile(mobile);

    if (!user) {
      return res.status(400).json({ error: 'Invalid Mobile number or otp ' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ error: 'Invalid otp' });
    }

    let resp = await otpVerify(mobile);
    const generateToken = await generateAuthTokens(user);
    console.log(generateAuthTokens);
    return res.status(200).json({
      success: true,
      message: 'Otp verified successFully',
      data: resp,
      accessToken: generateToken.access.token,
      refreshToken: generateToken.refresh.token,
    });
  } catch (err) {
    console.log(err);
    throw new ApiError(500, 'Internal Server Error');
  }
};

const updateProfile = async (req, res) => {
  logger.info('updateProfile api called');
  try {
    const { userId } = req.params;
    if (userId !== req.user.userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }
    const updatedUser = await updateUserData(userId, req.body);
    return res.status(200).json({ status: true, data: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const upload = multer({ storage }).single('profileImage');

const uploadProfilePicture = async (req, res) => {
  logger.info('uploadProfilePicture api called');
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: 'Error uploading file', error: err.message });
      }

      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }

      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const filePath = path.resolve(req.file.path);

      const updatedUser = await uploadProfileImage(userId, filePath);

      return res.status(200).json({ message: 'Profile image updated successfully', user: updatedUser });
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// get user profile details
const userProfileDetails = async (req, res) => {
  const userId = req.params.userId;

  const userDetails = await findUserDetails(userId);
  if (!userDetails) {
    return res.status(404).json({ message: 'User not found' });
  }
  return userDetails;
};

// user logoutAndRemovedRefreshToken

const logoutAndRemovedRefreshToken = async (req, res) => {
  const refreshToken = req.body.refreshToken;
  await logout(refreshToken);

  return res.status(203).send();
};

module.exports = {
  loginUser,
  updateProfile,
  uploadProfilePicture,
  verifyOtp,
  userProfileDetails,
  logoutAndRemovedRefreshToken,
};
