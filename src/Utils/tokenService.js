const Token = require("../Models/token.model");
const ApiError = require("./ApiError");
const { tokenTypes } = require("./tokenType");
const moment = require('moment');
const jwt = require('jsonwebtoken');
const generateToken = (userId, expires, type, secret = process.env.secret) => {
    const payload = {
      userId: userId,
      iat: moment().unix(),
      exp: expires.unix(),
      type,
    };
    return jwt.sign(payload, secret);
  };
  
 
  const saveToken = async (token, userId, expires, type, blacklisted = false) => {
    const tokenDoc = await Token.create({
      token,
      user: userId,
      expires: expires.toDate(),
      type,
      blacklisted,
    });
    return tokenDoc;
  };
  
 
  const verifyToken = async (token, type) => {
    const payload = jwt.verify(token, process.env.jwt.secret);
    const tokenDoc = await Token.findOne({ token, type, user: payload.sub, blacklisted: false });
    if (!tokenDoc) {
      throw new Error('Token not found');
    }
    return tokenDoc;
  };
  
  /**
   * Generate auth tokens
   * @param {User} user
   * @returns {Promise<Object>}
   */
  const generateAuthTokens = async (user) => {
    const accessTokenExpires = moment().add(process.env.accessExpirationMinutes, 'minutes');
    const accessToken = generateToken(user.id, accessTokenExpires, tokenTypes.ACCESS);
  
    const refreshTokenExpires = moment().add(process.env.refreshExpirationDays, 'days');
    const refreshToken = generateToken(user.id, refreshTokenExpires, tokenTypes.REFRESH);
    await saveToken(refreshToken, user.id, refreshTokenExpires, tokenTypes.REFRESH);
  
    return {
      access: {
        token: accessToken,
        expires: accessTokenExpires.toDate(),
      },
      refresh: {
        token: refreshToken,
        expires: refreshTokenExpires.toDate(),
      },
    };
  };
  
  const generateAuthTokensForCompany= async (company) => {
    const accessTokenExpires = moment().add(process.env.accessExpirationMinutes, 'minutes');
    const accessToken = generateToken(company._id, accessTokenExpires, tokenTypes.ACCESS);
  
    const refreshTokenExpires = moment().add(process.env.refreshExpirationDays, 'days');
    const refreshToken = generateToken(company._id, refreshTokenExpires, tokenTypes.REFRESH);
    await saveToken(refreshToken, company._id, refreshTokenExpires, tokenTypes.REFRESH);
  
    return {
      access: {
        token: accessToken,
        expires: accessTokenExpires.toDate(),
      },
      refresh: {
        token: refreshToken,
        expires: refreshTokenExpires.toDate(),
      },
    };
  };
  
 
  const generateResetPasswordToken = async (email) => {
    const user = await userService.getUserByEmail(email);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this email');
    }
    const expires = moment().add(process.env.resetPasswordExpirationMinutes, 'minutes');
    const resetPasswordToken = generateToken(user.id, expires, tokenTypes.RESET_PASSWORD);
    await saveToken(resetPasswordToken, user.id, expires, tokenTypes.RESET_PASSWORD);
    return resetPasswordToken;
  };
  
 
  const generateVerifyEmailToken = async (user) => {
    const expires = moment().add(process.env.verifyEmailExpirationMinutes, 'minutes');
    const verifyEmailToken = generateToken(user.id, expires, tokenTypes.VERIFY_EMAIL);
    await saveToken(verifyEmailToken, user.id, expires, tokenTypes.VERIFY_EMAIL);
    return verifyEmailToken;
  };
  
  module.exports = {
    generateToken,
    saveToken,
    verifyToken,
    generateAuthTokens,
    generateResetPasswordToken,
    generateVerifyEmailToken,
    generateAuthTokensForCompany
  };