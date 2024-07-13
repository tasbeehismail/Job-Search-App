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

export { addJob };