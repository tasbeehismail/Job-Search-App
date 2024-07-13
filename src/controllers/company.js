import Company from '../models/company.js';
import AppError from '../utils/appError.js';
import Job from '../models/job.js';

export const addCompany = async (req, res, next) => {
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

export const deleteCompany = async (req, res, next) => {
    const company = await Company.findOne({ companyHR: req.user._id });
    if(!company) {
        return next(new AppError('Company not found or you are not owner of any company', 404));
    }

    await company.deleteOne(company._id);
    return res.status(200).json({ message: 'Company deleted successfully' });
}

export const getCompany = async (req, res, next) => {
    const companyId = req.params.id
    
    const company = await Company.findById(companyId).select('-__v');

    if(!company) {
        return next(new AppError('Company not found', 404));
    }
    
    const jobs = await Job.find({ addedBy: { $in: company.companyHR } });

    const companyData = company.toObject();
    companyData.jobs = jobs;
    
    return res.status(200).json({ data: companyData });
}

export const searchCompany = async (req, res, next) => {
    const query = req.query.q;

    const companies = await Company.find({ companyName: { $regex: query, $options: 'i' } });
    
    if (!companies.length) {
        return next(new AppError('No companies found with that name', 404));
    }

    return res.status(200).json({ data: companies });
}