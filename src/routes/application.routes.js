import { Router } from "express";
import {getApplicationsForCompany} from '../controllers/application.js';
import asyncHandler from '../utils/asyncHandler.js';
import * as schema from "../validation/application.js";
import { validate } from "../services/validator.service.js";
import { verifyToken } from "../services/auth.service.js";
 
const router = Router();

router.get('/:companyId/:date', 
    //verifyToken(),
    //validate(schema.getApplicationsForCompany),
    asyncHandler(getApplicationsForCompany)
);

export default router;