const Joi = require('joi');

// Function to validate company registration request
const registerCompanyRequestValidation = (comapny) => {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
    name: Joi.string().min(5).max(255).required(),
    registrationNumber: Joi.string().min(5).max(255).required(),
    website: Joi.string().min(5).max(255).required(), // Ensures valid URI
    industry: Joi.string().min(5).max(255).required(),
    headquarters: Joi.string().min(5).max(255).required(),
    founded: Joi.date().required(), // Validates as a date

    size: Joi.number().required(),
    description: Joi.string().min(5).max(255).required(),
    logoUrl: Joi.string().min(5).max(255).uri().required(), // Ensures valid URI
    socialLinks: Joi.object().pattern(
      Joi.string(), 
      Joi.string().uri()
    ).required(), // Validates object with string keys and URI values
  });

  return schema.validate(comapny);
};

const companyLoginValidation = (comapny) => {
    const schema = Joi.object({
      email: Joi.string().min(5).max(255).required().email(),
      password: Joi.string().min(5).max(255).required(),
    });
  
    return schema.validate(comapny);
  };
const companyUpdateValidation = (comapny) => {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
        name: Joi.string().min(5).max(255).required(),
        registrationNumber: Joi.string().min(5).max(255).required(),
        website: Joi.string().min(5).max(255).required(), // Ensures valid URI
        industry: Joi.string().min(5).max(255).required(),
        headquarters: Joi.string().min(5).max(255).required(),
        founded: Joi.date().required(), // Validates as a date
        size: Joi.number().required(),
        description: Joi.string().min(5).max(255).required(),
        logoUrl: Joi.string().min(5).max(255).uri().required(), // Ensures valid URI
        socialLinks: Joi.object().pattern(
            Joi.string(),
            Joi.string().uri()
        ).required(), // Validates object with string keys and URI values
    });
    return schema.validate(comapny);
}


const forgotPasswordValidation = (comapny) => {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        newPassword: Joi.string().min(5).max(255).required(),
        confirmPassword: Joi.string().min(5).max(255).required(),


    });
    return schema.validate(comapny);
}

const resetPasswordValidation = (comapny) => {
    const schema = Joi.object({
        newPassword: Joi.string().min(5).max(255).required(),
        confirmPassword: Joi.string().min(5).max(255).required(),
    });
    return schema.validate(comapny);
}

module.exports = { registerCompanyRequestValidation,companyLoginValidation,forgotPasswordValidation,companyUpdateValidation ,resetPasswordValidation};
