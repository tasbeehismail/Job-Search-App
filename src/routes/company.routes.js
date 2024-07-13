import { Router } from "express";
import * as companyController from '../controllers/company.js';
import asyncHandler from '../utils/asyncHandler.js';
import * as schema from "../validation/company.js";
import { validate } from "../services/validator.service.js";
import { verifyToken } from "../services/auth.service.js";

const router = Router();

router.post('/add', 
    verifyToken(),
    validate(schema.addCompany), 
    asyncHandler(companyController.addCompany)
);

router.patch('/update',
    verifyToken(),
    validate(schema.updateCompany),
    asyncHandler(companyController.updateCompany)
)

router.delete('/delete', 
    verifyToken(),
    asyncHandler(companyController.deleteCompany)
);
router.get('/:id', 
    verifyToken(),
    asyncHandler(companyController.getCompany)
);


router.get('/search', 
    verifyToken(),
    asyncHandler(companyController.searchCompany)
);

router.get('/:id/applications', 
    verifyToken(),
    asyncHandler(companyController.getApplications)
);
export default router