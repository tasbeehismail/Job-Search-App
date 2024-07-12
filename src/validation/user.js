import Joi from 'joi';

const signUp = Joi.object({
  firstName: Joi.string().min(3).max(50).trim().required().messages({
    'any.required': 'First name is required.',
    'string.empty': 'First name cannot be empty.',
    'string.min': 'First name must be at least {#limit} characters long.',
    'string.max': 'First name cannot exceed {#limit} characters.',
  }),
  lastName: Joi.string().min(3).max(50).trim().required().messages({
    'any.required': 'Last name is required.',
    'string.empty': 'Last name cannot be empty.',
    'string.min': 'Last name must be at least {#limit} characters long.',
    'string.max': 'Last name cannot exceed {#limit} characters.',
  }),
  email: Joi.string().email().trim().required().messages({
    'any.required': 'Email is required.',
    'string.empty': 'Email cannot be empty.',
    'string.email': 'Email must be a valid email address.',
  }),
  recoveryEmail: Joi.string().email().trim().messages({
    'string.email': 'Recovery email must be a valid email address.',
  }),
  role: Joi.string().valid('User', 'Company_HR', 'Admin').required().messages({
    'any.required': 'Role is required.',
    'any.only': 'Role must be one of: user, company_HR.',
  }),
  password: Joi.string().min(6).max(128).pattern(/^[a-zA-Z0-9]{3,30}$/).required().messages({
    'any.required': 'Password is required.',
    'string.empty': 'Password cannot be empty.',
    'string.min': 'Password must be at least {#limit} characters long.',
    'string.max': 'Password cannot exceed {#limit} characters.',
  }),
  DOB: Joi.date().iso().required().messages({
    'any.required': 'Date of birth is required.',
    'date.base': 'Date of birth must be in YYYY-MM-DD format.',
  }),
  mobileNumber: Joi.string().required().pattern(new RegExp('^[0-9]{10}$')).messages({
    'string.pattern.base': 'Mobile number must be a valid 10-digit number.',
  }),
});

const logIn = Joi.object({
  loginField: Joi.alternatives().try(
    Joi.string().email().required().trim().messages({
      'any.required': 'Email is required for login.',
      'string.empty': 'Email cannot be empty for login.',
      'string.email': 'Please provide a valid email address for login.',
    }),
    Joi.string().pattern(new RegExp('^[0-9]{10}$')).required().messages({
      'any.required': 'Mobile number is required for login.',
      'string.empty': 'Mobile number cannot be empty for login.',
      'string.pattern.base': 'Please provide a valid 10-digit mobile number for login.',
    }),
    Joi.string().email().required().messages({
      'any.required': 'Recovery email is required for login.',
      'string.empty': 'Recovery email cannot be empty for login.',
      'string.email': 'Please provide a valid recovery email address for login.',
    })
  ).required().messages({
    'any.required': 'Login field is required.',
    'alternatives.match': 'Login field must be one of: email, mobile number, recovery email.',
  }),
  password: Joi.string().min(6).max(128).pattern(/^[a-zA-Z0-9]{3,30}$/).required().messages({
    'any.required': 'Password is required.',
    'string.empty': 'Password cannot be empty.',
    'string.min': 'Password must be at least {#limit} characters long.',
    'string.max': 'Password cannot exceed {#limit} characters.',
  }),
})

const updateAccount = Joi.object({
  email: Joi.string().email().trim().messages({
    'string.email': 'Email must be a valid email address.',
  }),
  mobileNumber: Joi.string().pattern(new RegExp('^[0-9]{10}$')).messages({
    'string.pattern.base': 'Mobile number must be a valid 10-digit number.',
  }),
  recoveryEmail: Joi.string().email().trim().messages({
    'string.email': 'Recovery email must be a valid email address.',
  }),
  firstName: Joi.string().min(3).max(50).trim().messages({
    'string.min': 'First name must be at least {#limit} characters long.',
    'string.max': 'First name cannot exceed {#limit} characters.',
  }),
  lastName: Joi.string().min(3).max(50).trim().messages({
    'string.min': 'Last name must be at least {#limit} characters long.',
    'string.max': 'Last name cannot exceed {#limit} characters.',
  }),
  DOB: Joi.date().iso().messages({
    'date.base': 'Date of birth must be in YYYY-MM-DD format.',
  }),
});

const getOtherUser = Joi.object({
  userId: Joi.string().required().messages({
    'any.required': 'User ID is required.',
    'string.empty': 'User ID cannot be empty.',
  }),
});

const updatePassword = Joi.object({
  currentPassword: Joi.string().min(6).max(128).pattern(/^[a-zA-Z0-9]{3,30}$/).required().messages({
    'any.required': 'Current password is required.',
    'string.empty': 'Current password cannot be empty.',
    'string.min': 'Current password must be at least {#limit} characters long.',
    'string.max': 'Current password cannot exceed {#limit} characters.',
  }),
  newPassword: Joi.string().min(6).max(128).pattern(/^[a-zA-Z0-9]{3,30}$/).required().messages({
    'any.required': 'New password is required.',
    'string.empty': 'New password cannot be empty.',
    'string.min': 'New password must be at least {#limit} characters long.',
    'string.max': 'New password cannot exceed {#limit} characters.',
  }),
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
    'any.required': 'Confirm password is required.',
    'string.empty': 'Confirm password cannot be empty.',
    'any.only': 'Passwords do not match.',
  }),
});

const forgetPassword = Joi.object({
  email: Joi.string().email().trim().required().messages({
    'any.required': 'Email is required.',
    'string.empty': 'Email cannot be empty.',
    'string.email': 'Email must be a valid email address.',
  }),
});

const getAccountsByRecoveryEmail = Joi.object({
  recoveryEmail: Joi.string().email().trim().required().messages({
    'any.required': 'Recovery email is required.',
    'string.empty': 'Recovery email cannot be empty.',
    'string.email': 'Recovery email must be a valid email address.',
  }),
});


const resetPassword = Joi.object({
  newPassword: Joi.string().min(6).max(128).pattern(/^[a-zA-Z0-9]{3,30}$/).required().messages({
    'string.base': 'New password should be a type of text',
    'string.empty': 'New password cannot be an empty field',
    'string.min': 'New password should have a minimum length of 8',
    'any.required': 'New password is a required field',
  }),
  otp: Joi.string().length(4).required().messages({
    'string.base': 'OTP should be a type of text',
    'string.empty': 'OTP cannot be an empty field',
    'string.length': 'OTP should be exactly 4 characters long',
    'any.required': 'OTP is a required field',
  }),
  email: Joi.string().email().trim().required().messages({
    'string.base': 'Email should be a type of text',
    'string.empty': 'Email cannot be an empty field',
    'string.email': 'Email must be a valid email',
    'any.required': 'Email is a required field',
  }),
});

const verifyEmail = Joi.object({
  email: Joi.string().email().trim().required().messages({
    'string.base': 'Email should be a type of text',
    'string.empty': 'Email cannot be an empty field',
    'string.email': 'Email must be a valid email',
    'any.required': 'Email is a required field',
  }),
  otp: Joi.string().length(4).required().messages({
    'string.base': 'OTP should be a type of text',
    'string.empty': 'OTP cannot be an empty field',
    'string.length': 'OTP should be exactly 4 characters long',
    'any.required': 'OTP is a required field',
  }),
});

export {
  signUp,
  logIn,
  updateAccount,
  getOtherUser,
  updatePassword,
  forgetPassword,
  getAccountsByRecoveryEmail,
  resetPassword,
  verifyEmail
};