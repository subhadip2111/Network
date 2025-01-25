const express = require('express');
const {
  registerNewCompany,
  loginCompany,
  resetCompanyPassword,
  forGotpassword,
} = require('../Controller/companyController');
const { updateProfile } = require('../Controller/userController');
const { authentication } = require('../Middleware/auth');

const companyRouter = express.Router();

// register comapny route
companyRouter.post('/company/register', registerNewCompany);

// login company route

companyRouter.post('/company/login', loginCompany);
// Add more routes here

// update company profile route
companyRouter.patch('/company/update/:companyId', authentication, updateProfile);

//forgot password route
companyRouter.post('/company/forgotpassword', forGotpassword);
//reset password route
companyRouter.post('/company/resetpassword/:comoanyId', authentication, resetCompanyPassword);

module.exports = companyRouter;
