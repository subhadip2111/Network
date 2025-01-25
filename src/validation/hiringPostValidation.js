const Joi = require('joi');

const hiringPostValidation = (hiringPost) => {
  const schema = Joi.object({
    companyId: Joi.string().min(5).required(),

    title: Joi.string().min(5).required(),
    description: Joi.string().min(5).required(),
    location: Joi.string().min(5).required(),
    jobType: Joi.string().min(5).required(),
    projectDemo: Joi.object({
      title: Joi.string().min(5).required(),
      description: Joi.string().min(5).required(),
      repositoryLink: Joi.string().min(5).required(),
      technologiesUsed: Joi.array().items(Joi.string().min(2)).required(),
      guidelines: Joi.string().min(5).required(),
      expectedOutcome: Joi.string().min(5).required(),
      submissionDeadline: Joi.date().required(),
    }).required(),

    evaluationCriteria: Joi.array().items(Joi.string().min(5)).required(),
    submissionInstructions: Joi.string().min(5).required(),
    faqs: Joi.array()
      .items(
        Joi.object({
          question: Joi.string().min(5).required(),
          answer: Joi.string().min(5).required(),
        })
      )
      .optional(),
    additionalInfo: Joi.string().min(5).optional(),
    banner: Joi.string().required(),
  });
  return schema.validate(hiringPost);
};



module.exports = { hiringPostValidation };
