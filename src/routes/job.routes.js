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
    authorizeRoles('Company_HR'),
    validate(schema.addJob), 
    asyncHandler(jobController.addJob)
)

router.patch('/update/:id',
    verifyToken(),
    authorizeRoles('Company_HR'),
    validate(schema.updateJob),
    asyncHandler(jobController.updateJob)
)

router.delete('/delete/:id', 
    verifyToken(),
    authorizeRoles('Company_HR'),
    validate(schema.jobId),
    asyncHandler(jobController.deleteJob)
);

router.get('/all', 
    verifyToken(),
    authorizeRoles('Company_HR', 'User'),
    asyncHandler(jobController.getAllJobs)
);

router.get('/company', 
    verifyToken(),
    authorizeRoles('Company_HR', 'User'),
    validate(schema.getJobsByCompanyName),
    asyncHandler(jobController.getJobsByCompanyName)
);

router.get('/filter',
    verifyToken(),
    authorizeRoles('Company_HR', 'User'),
    validate(schema.getJobsByFilters),
    asyncHandler(jobController.getJobsByFilters)
);

router.post('/apply/:jobId', 
    verifyToken(),
    authorizeRoles('User'),
    uploadSingleFile('userResume'), // Handle the file upload
    validate(applyJobSchema),
    asyncHandler(jobController.applyJob)
);

export default router