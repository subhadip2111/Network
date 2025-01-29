const Joi = require('joi');

const createFeedValidation = (feed) => {
  const schema = Joi.object({
    title: Joi.string().min(5).required(),
    description: Joi.string().min(5).required(),
    image: Joi.string().uri().optional(), // Ensure it is a valid URL
    links: Joi.array().items(Joi.string().uri()).optional(), // Validate each link as a URL
    videoUrl: Joi.string().uri().optional(), // Ensure it is a valid URL
    tags: Joi.array().items(Joi.string().trim()).min(1).required(), // At least one tag
    targetProfileTypes: Joi.array()
      .items(Joi.string().valid('student', 'beginner', 'intermediate', 'experienced'))
      .required(),
    createdBy: Joi.string().optional(), // Can be validated as an ObjectId if needed
    feedType: Joi.string()
      .valid('article', 'idea', 'resources', 'project', 'event')
      .required(),
  });
  return schema.validate(feed);
};

const editFeedValidation = (feed) => {
  const schema = Joi.object({
    title: Joi.string().min(5).optional(),
    description: Joi.string().min(5).optional(),
    image: Joi.string().uri().optional(),
    links: Joi.array().items(Joi.string().uri()).optional(),
    videoUrl: Joi.string().uri().optional(),
    tags: Joi.array().items(Joi.string().trim()).min(1).optional(),
    targetProfileTypes: Joi.array()
      .items(Joi.string().valid('student', 'beginner', 'intermediate', 'experienced'))
      .optional(),
    createdBy: Joi.string().optional(),
    feedType: Joi.string()
      .valid('article', 'idea', 'resources', 'project', 'event')
      .optional(),
  });
  return schema.validate(feed);
};

module.exports = { createFeedValidation, editFeedValidation };
