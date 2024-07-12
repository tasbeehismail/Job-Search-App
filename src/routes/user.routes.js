import { Router } from "express";
import * as userController from '../controllers/user.js';
import { existingUser } from "../middleware/existingUser.js";
import asyncHandler from '../utils/asyncHandler.js';
import * as schema from "../validation/user.js";
import { validate } from "../services/validator.service.js";
import { verifyToken } from "../services/auth.service.js";

const router = Router();

// Auth routes
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

// User routes

router.get('/me',  
  verifyToken(),
  asyncHandler(userController.getMe)
);

router.get('/account/:id', 
  validate(schema.getOtherUser),
  asyncHandler(userController.getOtherUser)
);

router.patch('/account', 
  verifyToken(),
  validate(schema.updateAccount),
  asyncHandler(existingUser),
  asyncHandler(userController.updateAccount)
);

router.patch('/password', 
  verifyToken(),
  validate(schema.updatePassword),
  asyncHandler(userController.updatePassword)
);

router.delete('/account', 
  verifyToken(),
  asyncHandler(userController.deleteAccount)
);

router.get('/accounts', 
  validate(schema.getAccountsByRecoveryEmail),
  asyncHandler(userController.getAccountsByRecoveryEmail)
);

export default router;
