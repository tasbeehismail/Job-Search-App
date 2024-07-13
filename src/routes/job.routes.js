import { Router } from "express";
import * as jobController from '../controllers/job.js';
import asyncHandler from '../utils/asyncHandler.js';
import * as schema from "../validation/job.js";
import { validate } from "../services/validator.service.js";
import { verifyToken } from "../services/auth.service.js";
import { authorizeRoles } from '../middleware/authorizeRoles.js';
 
const router = Router();

router.post('/add', 
    verifyToken(),
    asyncHandler(authorizeRoles('CompanyHR')),
    validate(schema.addJob), 
    asyncHandler(jobController.addJob)
)


export default router