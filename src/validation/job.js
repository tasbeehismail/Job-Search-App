import Joi from 'joi';

const addJob = Joi.object({
  jobTitle: Joi.string().required().messages({
    'string.base': 'Job title must be a string.',
    'string.empty': 'Job title cannot be empty.',
    'any.required': 'Job title is required.'
  }),
  jobLocation: Joi.string().valid('onsite', 'remotely', 'hybrid').required().messages({
    'any.only': 'Job location must be either onsite, remotely, or hybrid.',
    'any.required': 'Job location is required.'
  }),
  workingTime: Joi.string().valid('part-time', 'full-time').required().messages({
    'any.only': 'Working time must be either part-time or full-time.',
    'any.required': 'Working time is required.'
  }),
  seniorityLevel: Joi.string().valid('Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO').required().messages({
    'any.only': 'Seniority level must be one of Junior, Mid-Level, Senior, Team-Lead, or CTO.',
    'any.required': 'Seniority level is required.'
  }),
  jobDescription: Joi.string().required().messages({
    'string.base': 'Job description must be a string.',
    'string.empty': 'Job description cannot be empty.',
    'any.required': 'Job description is required.'
  }),
  technicalSkills: Joi.array().items(Joi.string()).required().messages({
    'array.base': 'Technical skills must be an array of strings.',
    'any.required': 'Technical skills are required.'
  }),
  softSkills: Joi.array().items(Joi.string()).required().messages({
    'array.base': 'Soft skills must be an array of strings.',
    'any.required': 'Soft skills are required.'
  })
});

const updateJob = Joi.object({
  jobTitle: Joi.string().messages({
    'string.base': 'Job title must be a string.',
    'string.empty': 'Job title cannot be empty.',
  }),
  jobLocation: Joi.string().valid('onsite', 'remotely', 'hybrid').messages({
    'any.only': 'Job location must be either onsite, remotely, or hybrid.',
  }),
  workingTime: Joi.string().valid('part-time', 'full-time').messages({
    'any.only': 'Working time must be either part-time or full-time.',
  }),
  seniorityLevel: Joi.string().valid('Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO').messages({
    'any.only': 'Seniority level must be one of Junior, Mid-Level, Senior, Team-Lead, or CTO.',
  }),
  jobDescription: Joi.string().messages({
    'string.base': 'Job description must be a string.',
    'string.empty': 'Job description cannot be empty.',
  }),
  technicalSkills: Joi.array().items(Joi.string()).messages({
    'array.base': 'Technical skills must be an array of strings.',
  }),
  softSkills: Joi.array().items(Joi.string()).messages({
    'array.base': 'Soft skills must be an array of strings.',
  }),
  id: Joi.string().required().hex().length(24).messages({
    'any.required': 'Job ID is required.',
    'string.empty': 'Job ID cannot be empty.',
    'string.hex': 'Job ID must be a hexadecimal string.',
    'string.length': 'Job ID must be 24 characters long.',
  })
});

const jobId = Joi.object({
  id: Joi.string().required().hex().length(24).messages({
    'any.required': 'Job ID is required.',
    'string.empty': 'Job ID cannot be empty.',
    'string.hex': 'Job ID must be a hexadecimal string.',
    'string.length': 'Job ID must be 24 characters long.',
  }),
})

export { 
  addJob,
  updateJob, 
  jobId
};