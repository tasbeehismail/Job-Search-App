import { Router } from "express";
import * as companyController from '../controllers/company.js';
import asyncHandler from '../utils/asyncHandler.js';
import * as schema from "../validation/company.js";
import { validate } from "../services/validator.service.js";
import { verifyToken } from "../services/auth.service.js";
import { authorizeRoles } from '../middleware/authorizeRoles.js';
 
const router = Router();

router.post('/add', 
    verifyToken(),
    authorizeRoles('Company_HR'),
    validate(schema.addCompany), 
    asyncHandler(companyController.addCompany)
);

router.patch('/update',
    verifyToken(),
    authorizeRoles('Company_HR'),
    validate(schema.updateCompany),
    asyncHandler(companyController.updateCompany)
)

router.delete('/delete', 
    verifyToken(),
    authorizeRoles('Company_HR'),
    asyncHandler(companyController.deleteCompany)
);

router.get('/specific/:id', 
    verifyToken(),
    authorizeRoles('Company_HR'),
    validate(schema.getCompany),
    asyncHandler(companyController.getCompany)
);

router.get('/search', 
    verifyToken(),
    authorizeRoles('Company_HR', 'User'),
    validate(schema.searchCompany),
    asyncHandler(companyController.searchCompany)
);

router.get('/:jobId/applications', 
    verifyToken(),
    authorizeRoles('Company_HR'),
    validate(schema.getApplications),
    asyncHandler(companyController.getApplications)
);

export default router