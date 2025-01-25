const {
  registerCompany,
  findCompanyByEmail,
  comapnyLogin,
  updateCompanyData,
} = require('../services/companyprofileService');
const { sendCompanyWelcomeEmail, sendForgotPasswordOTP, sendCompanyPasswordResetEmail } = require('../services/emailService');
const ApiError = require('../Utils/ApiError');
const logger = require('../Utils/logger');
const {
  registerCompanyRequestValidation,
  companyLoginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} = require('../validation/companyValidation');

const registerNewCompany = async (req, res) => {
  logger.info('registerCompany api called');
  try {
    const { error } = registerCompanyRequestValidation(req.body);
    if (error) {
      throw new ApiError(400, error.details[0].message);
    }
    const otp = Math.floor(100000 + Math.random() * 900000);

    const { email, password } = req.body;
    const existingCompany = await findCompanyByEmail(email);
    if (existingCompany) {
      return res.status(400).json({ error: 'The email is already registered. Please log in to continue.' });
    }
    const newCompany = await registerCompany(req.body, otp);
    await sendCompanyWelcomeEmail(email, newCompany.name);
    return res.status(201).json({ message: 'Company registered successfully', data: newCompany });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const loginCompany = async (req, res) => {
  logger.info('loginCompany api called');
  console.log(req.body);
  const { error } = companyLoginValidation(req.body);

  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  try {
    const { email, password } = req.body;

    console.log('email', email);
    const comapny = await findCompanyByEmail(email);
    if (!comapny) {
      return res.status(400).json({ error: 'Invalid email' });
    }
    console.log(comapny);
    const isMatch = await comapny.isValidPassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const { accessToken, refreshToken } = await comapnyLogin(comapny);
    console.log(comapny);
    return res.status(200).json({ message: 'Company logged in successfully', data: comapny, accessToken, refreshToken });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateProfile = async (req, res) => {
  logger.info('updateProfile api called');
  const { error } = companyUpdateValidation(req.body);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }
  try {
    const { companyId } = req.params;
    if (companyId !== req.company.companyId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }
    const updatedCompany = await updateCompanyData(companyId, req.body);
    return res.status(200).json({ status: true, data: updatedCompany });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const resetCompanyPassword = async (req, res) => {
  logger.info('resetCompanyPassword api called');
  try {
    const { error } = resetPasswordValidation(req.body);
    if (error) {
      throw new ApiError(400, error.details[0].message);
    }
    const { email, newPassword, confirmPassword } = req.body;
    const company = await findCompanyByEmail(email);
    if (!company) {
      return res.status(400).json({ error: 'Company not found' });
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    company.otp = otp;
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'new pass and confirm password not matched' });
    }
    company.password = newPassword;
    await company.save();
    await sendCompanyPasswordResetEmail(email, company.name, otp);
    // Send password reset email
    return res.status(200).json({ message: 'Password reset email sent successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const forGotpassword = async (req, res) => {
  logger.info('forGotpassword api called');
  try {
    const { error } = forgotPasswordValidation(req.body);
    if (error) {
      throw new ApiError(400, error.details[0].message);
    }
    const { email ,newPassword,confirmPassword} = req.body;
    const company = await findCompanyByEmail(email);
    if (!company) {
      return res.status(400).json({ error: 'Company not found' });
    }
    // const otp = Math.floor(100000 + Math.random() * 900000);
    // company.otp = otp;

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ error: 'new pass and confirm password not matched' });
      }
      company.password = newPassword;
    await company.save();
    // Send password reset email

    return res.status(200).json({ message: 'Password reset  successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { registerNewCompany, loginCompany, updateProfile, resetCompanyPassword, forGotpassword };
