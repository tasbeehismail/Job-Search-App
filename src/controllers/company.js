import Company from '../models/company.js';
import { generateToken } from '../services/auth.service.js';
import AppError from '../utils/appError.js';


export const addCompany = async (req, res, next) => {
    if(req.user.role !== 'Company_HR') {
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
    const company = await Company.findOne({ companyHR: req.user._id });

    if(!company) {
        return next(new AppError('Company not found', 404));
    }

    if(req.user.role !== 'Company_HR') {
        return next(new AppError('You are not authorized to perform this action', 403));
    }

    const { companyName, description, industry, address, numberOfEmployees, companyEmail } = req.body;
    company.companyName = companyName || company.companyName;
    company.description = description || company.description;
    company.industry = industry || company.industry;
    company.address = address || company.address;
    company.numberOfEmployees = numberOfEmployees || company.numberOfEmployees;
    company.companyEmail = companyEmail || company.companyEmail;
    await company.save();

    return res.status(200).json({ message: 'Company updated successfully', data: company });
}
