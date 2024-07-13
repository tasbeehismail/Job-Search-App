import Joi from 'joi';

const applyJobSchema = Joi.object({
  jobId: Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.empty': 'Job ID is required.',
      'string.pattern.base': 'Job ID must be a valid hexadecimal string.',
    }),

  userTechSkills: Joi.array().items(Joi.string()).required()
    .messages({
      'array.required': 'Technical skills are required.',
      'array.base': 'Technical skills must be provided as an array.',
      'any.required': 'Each technical skill must be a string.',
      'string.empty': 'Technical skills must not be empty strings.',
    }),

  userSoftSkills: Joi.array().items(Joi.string()).required()
    .messages({
      'array.required': 'Soft skills are required.',
      'array.base': 'Soft skills must be provided as an array.',
      'any.required': 'Each soft skill must be a string.',
      'string.empty': 'Soft skills must not be empty strings.',
    })
});

const getApplicationsForCompany = Joi.object({
  companyId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.empty': 'Company ID is required.',
      'string.pattern.base': 'Company ID must be a valid hexadecimal string.',
    }),
    date: Joi.date().iso().messages({
      'date.base': 'Date must be in YYYY-MM-DD format.',
    }),
});

export { applyJobSchema, getApplicationsForCompany };
