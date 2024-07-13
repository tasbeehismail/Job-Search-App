import Joi from 'joi';

// Regex to match the range format (1-10, 11-20, ...)
const numberOfEmployeesRegex = /^\d+-\d+$/;

const rangeMessages = {
  base: 'must be in the format of a range (e.g., 1-10, 11-20).',
  custom: 'The upper bound must be greater than the lower bound.'
};

// Custom validation for number of employees range
const numberOfEmployeesValidation = (value, helpers) => {
  const [lower, upper] = value.split('-').map(Number);
  if (lower >= upper) {
    return helpers.message(rangeMessages.custom);
  }
  return value;
};

const addCompany = Joi.object({
  companyName: Joi.string().required().messages({
    'string.base': `Company name must be a string.`,
    'string.empty': `Company name cannot be empty.`,
    'any.required': `Company name is required.`
  }),
  description: Joi.string().required().messages({
    'string.base': `Description must be a string.`,
    'string.empty': `Description cannot be empty.`,
    'any.required': `Description is required.`
  }),
  industry: Joi.string().required().messages({
    'string.base': `Industry must be a string.`,
    'string.empty': `Industry cannot be empty.`,
    'any.required': `Industry is required.`
  }),
  address: Joi.string().required().messages({
    'string.base': `Address must be a string.`,
    'string.empty': `Address cannot be empty.`,
    'any.required': `Address is required.`
  }),
  numberOfEmployees: Joi.string().pattern(numberOfEmployeesRegex).required()
  .custom(numberOfEmployeesValidation)
  .messages({
    'string.base': `Number of employees must be a string.`,
    'string.empty': `Number of employees`,
    'string.pattern.base': `Number of employees ${rangeMessages.base}`,
    'any.required': `Number of employees is required.`
  }),
  companyEmail: Joi.string().email().required().messages({
    'string.base': `Company email must be a string.`,
    'string.email': 'Company email must be a valid email.',
    'string.empty': `Company email cannot be empty.`,
    'any.required': `Company email is required.`
  })
});

// Update company schema (all fields optional)
const updateCompany = Joi.object({
  companyName: Joi.string().messages({
    'string.base': `Company name must be a string.`,
    'string.empty': `Company name cannot be empty.`,
  }),
  description: Joi.string().messages({
    'string.base': `Description must be a string.`,
    'string.empty': `Description cannot be empty.`,
  }),
  industry: Joi.string().messages({
    'string.base': `Industry must be a string.`,
    'string.empty': `Industry cannot be empty.`,
  }),
  address: Joi.string().messages({
    'string.base': `Address must be a string.`,
    'string.empty': `Address cannot be empty.`,
  }),
  numberOfEmployees: Joi.string().pattern(numberOfEmployeesRegex)
  .custom(numberOfEmployeesValidation)
  .messages({
    'string.base': `Number of employees must be a string.`,
    'string.empty': `Number of employees cannot be empty.`,
    'string.pattern.base': `Number of employees ${rangeMessages.base}`,
  }),
  companyEmail: Joi.string().email().messages({
    'string.base': `Company email must be a string.`,
    'string.email': 'Company email must be a valid email.',
    'string.empty': `Company email cannot be empty.`,
  })
});

const getCompany = Joi.object({
  id: Joi.string().required().hex().length(24).messages({
    'any.required': 'Company ID is required.',
    'string.empty': 'Company ID cannot be empty.',
    'string.hex': 'Company ID must be a hexadecimal string.',
    'string.length': 'Company ID must be 24 characters long.',
  }),
});

const searchCompany = Joi.object({
  q: Joi.string().min(1).required().messages({
    'string.empty': 'Search query cannot be empty',
    'any.required': 'Search query is required'
  })
});

export {
  addCompany,
  updateCompany,
  getCompany,
  searchCompany
};