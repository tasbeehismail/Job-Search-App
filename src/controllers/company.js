import Company from '../models/company.js';
import AppError from '../utils/appError.js';
import Job from '../models/job.js';
import Application from '../models/application.js';
import User from '../models/user.js';

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
    const companyId = req.params.id
    const company = await Company.findById({ _id: companyId });
    if(!company) {
        return next(new AppError('Company not found', 404));
    }
    if(company.companyHR.toString() !== req.user._id.toString()) {
        return next(new AppError('Only the company owner can update the data', 403));
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
    const companyId = req.params.id
    const company = await Company.findById({ _id: companyId });
    if(!company) {
        return next(new AppError('Company not found', 404));
    }
    if(company.companyHR.toString() !== req.user._id.toString()) {
        return next(new AppError('Only the company owner can delete the data', 403));
    }

    const jobs = await Job.find({ addedBy: company.companyHR });
    const jobIds = jobs.map(job => job._id);

    await Job.deleteMany({ addedBy: company.companyHR });

    // Delete all applications related to these jobs
    await Application.deleteMany({ jobId: { $in: jobIds } });

    // Update users who were company HR of this company
    await User.updateMany(
      { _id: company.companyHR },
      { $set: { role: 'User' } }
    );

    // Finally, delete the company
    await Company.findByIdAndDelete(companyId);

    return res.status(200).json({ message: 'Company and related documents deleted successfully' });
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

export const getApplications = async (req, res, next) => {
    const { jobId } = req.params;
    const userId = req.user._id; // This is the company owner's ID

    const job = await Job.findById(jobId);

    if (!job) {
        return next(new AppError('Job not found', 404));
    }

    if (job.addedBy.toString() !== userId.toString()) {
        return next(new AppError('You do not have permission to view applications for this job', 403));
    }

    const applications = await Application.find({ jobId }).populate('userId');

    const formattedApplications = applications.map(app => ({
        _id: app._id,
        jobId: app.jobId,
        userTechSkills: app.userTechSkills,
        userSoftSkills: app.userSoftSkills,
        userResume: app.userResume,
        user: app.userId 
    }));

    res.status(200).json({
        message: 'Applications retrieved successfully',
        data: formattedApplications
    });
}