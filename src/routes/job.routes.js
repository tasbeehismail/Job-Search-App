import { Router } from "express";
import * as jobController from '../controllers/job.js';
import asyncHandler from '../utils/asyncHandler.js';
import * as schema from "../validation/job.js";
import { validate } from "../services/validator.service.js";
import { verifyToken } from "../services/auth.service.js";
import { authorizeRoles } from '../middleware/authorizeRoles.js';
import { applyJobSchema } from '../validation/application.js';
import { uploadSingleFile } from '../middleware/uploadFiles.js'; // Make sure the import path is correct

const router = Router();

router.post('/add', 
    verifyToken(),
    asyncHandler(authorizeRoles('CompanyHR')),
    validate(schema.addJob), 
    asyncHandler(jobController.addJob)
)

router.post('/apply/:jobId', 
    verifyToken(),
    asyncHandler(authorizeRoles('User')),
    uploadSingleFile('userResume'), // Handle the file upload
    validate(applyJobSchema),
    asyncHandler(jobController.applyJob)
);

export default router