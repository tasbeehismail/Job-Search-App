import Company from '../models/company.js';
import { generateToken } from '../services/auth.service.js';
import AppError from '../utils/appError.js';


export const addCompany = async (req, res, next) => {
    if(req.user.role !== 'companyHR') {
        return next(new AppError('You are not authorized to perform this action', 403));
    }

    const companyHR = req.user._id;
    const { companyName, description, industry, address, numberOfEmployees, companyEmail } = req.body;
    const company = await Company.create({ 
        companyName,
        description,
        industry,
        address,
        numberOfEmployees,
        companyEmail,
        companyHR
    });
    return res.status(200).json({ message: 'Company added successfully', data: company });
}

export const updateCompany = async (req, res, next) => {
   
}

