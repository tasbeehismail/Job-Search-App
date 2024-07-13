import Joi from 'joi';

// Regex to match the range format (1-10, 11-20, ...)
const numberOfEmployeesRegex = /^\d+-\d+$/;

const addCompany = Joi.object({
  companyName: Joi.string().required().messages({
    'string.base': 'Company name must be a string.',
    'string.empty': 'Company name cannot be empty.',
    'any.required': 'Company name is required.'
  }),
  description: Joi.string().required().messages({
    'string.base': 'Description must be a string.',
    'string.empty': 'Description cannot be empty.',
    'any.required': 'Description is required.'
  }),
  industry: Joi.string().required().messages({
    'string.base': 'Industry must be a string.',
    'string.empty': 'Industry cannot be empty.',
    'any.required': 'Industry is required.'
  }),
  address: Joi.string().required().messages({
    'string.base': 'Address must be a string.',
    'string.empty': 'Address cannot be empty.',
    'any.required': 'Address is required.'
  }),
  numberOfEmployees: Joi.string().pattern(numberOfEmployeesRegex).required().custom((value, helpers) => {
    const [lower, upper] = value.split('-').map(Number);
    if (lower >= upper) {
      return helpers.message('The upper bound must be greater than the lower bound.');
    }
    return value;
  }).messages({
    'string.base': 'Number of employees must be a string.',
    'string.empty': 'Number of employees cannot be empty.',
    'string.pattern.base': 'Number of employees must be in the format of a range (e.g., 1-10, 11-20).',
    'any.required': 'Number of employees is required.'
  }),
  companyEmail: Joi.string().email().required().messages({
    'string.base': 'Company email must be a string.',
    'string.email': 'Company email must be a valid email.',
    'string.empty': 'Company email cannot be empty.',
    'any.required': 'Company email is required.'
  })
});

export {
  addCompany
};
