import { Router } from "express";
import * as jobController from '../controllers/job.js';
import asyncHandler from '../utils/asyncHandler.js';
import * as schema from "../validation/job.js";
import { validate } from "../services/validator.service.js";
import { verifyToken } from "../services/auth.service.js";
import { checkCompanyHR } from '../middleware/checkCompanyHR.js';
 
const router = Router();

router.post('/add', 
    verifyToken(),
    asyncHandler(checkCompanyHR),
    validate(schema.addJob), 
    asyncHandler(jobController.addJob)
)


export default router