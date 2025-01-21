const express = require('express');
const {
  loginUser,
  updateProfile,
  uploadProfilePicture,
  verifyOtp,
  userProfileDetails,
  logoutAndRemovedRefreshToken,
  generateNewAuthTokens,
} = require('../Controller/userController');
const { authentication } = require('../Middleware/auth');
const router = express.Router();

router.post('/user/login', loginUser);
router.post('/user/verifyotp', verifyOtp);
router.patch('/user/update/:userId', authentication, updateProfile);
router.patch('/user/upload/:userId', authentication,uploadProfilePicture);
router.get('/user/profile/:userId',authentication, userProfileDetails);
router.post('/user/logout', logoutAndRemovedRefreshToken);
router.post('/user/refresh', authentication,generateNewAuthTokens);


module.exports = router;
