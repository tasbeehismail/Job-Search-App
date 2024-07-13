import Joi from 'joi';

// Regex to match the range format (1-10, 11-20, ...)
const numberOfEmployeesRegex = /^\d+-\d+$/;

// Common validation messages
const stringMessages = {
  base: 'must be a string.',
  empty: 'cannot be empty.',
  required: 'is required.'
};

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

// Company schema
const companySchema = {
  companyName: Joi.string().required().messages({
    'string.base': `Company name ${stringMessages.base}`,
    'string.empty': `Company name ${stringMessages.empty}`,
    'any.required': `Company name ${stringMessages.required}`
  }),
  description: Joi.string().required().messages({
    'string.base': `Description ${stringMessages.base}`,
    'string.empty': `Description ${stringMessages.empty}`,
    'any.required': `Description ${stringMessages.required}`
  }),
  industry: Joi.string().required().messages({
    'string.base': `Industry ${stringMessages.base}`,
    'string.empty': `Industry ${stringMessages.empty}`,
    'any.required': `Industry ${stringMessages.required}`
  }),
  address: Joi.string().required().messages({
    'string.base': `Address ${stringMessages.base}`,
    'string.empty': `Address ${stringMessages.empty}`,
    'any.required': `Address ${stringMessages.required}`
  }),
  numberOfEmployees: Joi.string().pattern(numberOfEmployeesRegex).required()
  .custom(numberOfEmployeesValidation)
  .messages({
    'string.base': `Number of employees ${stringMessages.base}`,
    'string.empty': `Number of employees ${stringMessages.empty}`,
    'string.pattern.base': `Number of employees ${rangeMessages.base}`,
    'any.required': `Number of employees ${stringMessages.required}`
  }),
  companyEmail: Joi.string().email().required().messages({
    'string.base': `Company email ${stringMessages.base}`,
    'string.email': 'Company email must be a valid email.',
    'string.empty': `Company email ${stringMessages.empty}`,
    'any.required': `Company email ${stringMessages.required}`
  })
};

// Add company schema
const addCompany = Joi.object(companySchema);

// Update company schema (all fields optional)
const updateCompany = Joi.object({
  companyName: Joi.string().messages({
    'string.base': `Company name ${stringMessages.base}`,
    'string.empty': `Company name ${stringMessages.empty}`,
  }),
  description: Joi.string().messages({
    'string.base': `Description ${stringMessages.base}`,
    'string.empty': `Description ${stringMessages.empty}`,
  }),
  industry: Joi.string().messages({
    'string.base': `Industry ${stringMessages.base}`,
    'string.empty': `Industry ${stringMessages.empty}`,
  }),
  address: Joi.string().messages({
    'string.base': `Address ${stringMessages.base}`,
    'string.empty': `Address ${stringMessages.empty}`,
  }),
  numberOfEmployees: Joi.string().pattern(numberOfEmployeesRegex)
  .custom(numberOfEmployeesValidation)
  .messages({
    'string.base': `Number of employees ${stringMessages.base}`,
    'string.empty': `Number of employees ${stringMessages.empty}`,
    'string.pattern.base': `Number of employees ${rangeMessages.base}`,
  }),
  companyEmail: Joi.string().email().messages({
    'string.base': `Company email ${stringMessages.base}`,
    'string.email': 'Company email must be a valid email.',
    'string.empty': `Company email ${stringMessages.empty}`,
  })
});

export {
  addCompany,
  updateCompany
};