const companyProfileModel = require('../Models/companyProfile.model.js');
const { generateAuthTokensForCompany } = require('../Utils/tokenService.js');
const registerCompany = async (data, otp) => {
  try {
    const newCompany = await companyProfileModel.create({
      ...data,
      otp: otp,
    });
    return newCompany;
  } catch (error) {
    console.log(error);
    throw new Error('Error in registering company');
  }
};

const findCompanyByEmail = async (email) => {
  try {
    const find_company = await companyProfileModel.findOne({ email: email });
    return find_company;
  } catch (error) {
    console.log(error);
    throw new Error('Error in finding company by email');
  }
};

   const comapnyLogin = async (comapny) => {
    try {
     
        const token = await generateAuthTokensForCompany(comapny);
        const accessToken = token.access.token;
        const refreshToken = token.refresh.token;
        return { comapny, accessToken, refreshToken };
    } catch (error) {
        console.error('Error during company login:', error);
        throw error; // Re-throw the error after logging it
    }
}

const findComapnyById = async (companyId) => {
  console.log("company-id",companyId)
  try{  
    const company = await companyProfileModel.findOne({_id:companyId});
    console.log("company-from service",company)
    return company;
  } catch (error) {
    console.error('Error finding company by id:', error);
    throw error;
  }}
updateCompanyData = async (companyId, data) => {
  try {
    const updatedCompany = await companyProfileModel.findByIdAndUpdate(companyId, data, { new: true });
    return updatedCompany;}
    catch (error) {
        console.error('Error updating company data:', error);
        throw error
    }
    }

module.exports = {
  registerCompany,
  findCompanyByEmail,
  comapnyLogin,
  updateCompanyData,
  findComapnyById
};
