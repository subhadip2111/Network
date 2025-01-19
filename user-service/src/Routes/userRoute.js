const express=require('express');
const { loginUser, updateProfile, uploadProfilePicture, verifyOtp } = require('../Controller/userController');
const { authentication } = require('../Middleware/auth');
const router=express.Router();


router.post('/user/login',loginUser);
router.post('/user/verifyotp',verifyOtp)
router.patch('/user/update/:userId',authentication,updateProfile);
router.patch('/user/upload/:userId',uploadProfilePicture);


module.exports=router;