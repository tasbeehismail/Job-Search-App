import { Router } from "express";
import * as userController from '../controllers/user.js';
import { existingUser } from "../middleware/existingUser.js";
import asyncHandler from '../utils/asyncHandler.js';
import * as schema from "../validation/user.js";
import { validate } from "../services/validator.service.js";
import { verifyToken as authenticateToken } from "../services/auth.service.js";

const router = Router();

// User routes
router.post('/signup', 
  validate(schema.signUp), 
  asyncHandler(existingUser), 
  asyncHandler(userController.signup)
);

router.post('/login', 
  validate(schema.logIn), 
  asyncHandler(userController.login)
);

router.post('/verify-email', 
  validate(schema.verifyEmail),
  asyncHandler(userController.verifyEmail)
);

router.post('/forgot-password', 
  validate(schema.forgetPassword),
  asyncHandler(userController.forgotPassword)
);

router.post('/reset-password', 
  validate(schema.resetPassword), 
  asyncHandler(userController.resetPassword)
);

export default router;
