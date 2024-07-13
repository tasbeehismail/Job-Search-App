import Company from '../models/company.js';
import AppError from '../utils/appError.js';
import Job from '../models/job.js';
import Application from '../models/application.js';
import User from '../models/user.js';

/**
 * @desc Add a new company
 * @route POST /company/add
 * @access Private
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user
 * @param {Object} req.body - Request body containing company details
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const addCompany = async (req, res, next) => {
    // Extract the authenticated user's ID (company HR)
    const companyHR = req.user._id;
    // Destructure company details from the request body
    const { companyName, description, industry, address, numberOfEmployees, companyEmail } = req.body;
    // Create a new company document in the database
    const company = await Company.create({ 
        companyName,
        description,
        industry,
        address,
        numberOfEmployees,
        companyEmail,
        companyHR
    });
    // Send a success response with the created company data
    return res.status(200).json({ message: 'Company added successfully', data: company });
}
/**
 * @desc Update a company's details
 * @route PATCH /api/company/update/:id
 * @access Private
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {String} req.params.id - Company ID
 * @param {Object} req.user - Authenticated user
 * @param {Object} req.body - Request body containing updated company details
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const updateCompany = async (req, res, next) => {
    // Extract the company ID from the request parameters
    const companyId = req.params.id
    // Find the company by ID in the database
    const company = await Company.findById({ _id: companyId });
    // If the company is not found, return a 404 error
    if(!company) {
        return next(new AppError('Company not found', 404));
    }
    // Check if the authenticated user is the company HR
    if(company.companyHR.toString() !== req.user._id.toString()) {
        return next(new AppError('Only the company owner can update the data', 403));
    }
    // Destructure the updated company details from the request body
    const { companyName, description, industry, address, numberOfEmployees, companyEmail } = req.body;
    // Update the company details if provided, otherwise keep the existing values
    company.companyName = companyName || company.companyName;
    company.description = description || company.description;
    company.industry = industry || company.industry;
    company.address = address || company.address;
    company.numberOfEmployees = numberOfEmployees || company.numberOfEmployees;
    company.companyEmail = companyEmail || company.companyEmail;
    // Save the updated company document
    await company.save();
    // Send a success response with the updated company data
    return res.status(200).json({ message: 'Company updated successfully', data: company });
}
/**
 * @desc Delete a company and related documents
 * @route DELETE /api/company/delete/:id
 * @access Private
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {String} req.params.id - Company ID
 * @param {Object} req.user - Authenticated user
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const deleteCompany = async (req, res, next) => {
    // Extract the company ID from the request parameters
    const companyId = req.params.id
    // Find the company by ID in the database
    const company = await Company.findById({ _id: companyId });
    // If the company is not found, return a 404 error
    if(!company) {
        return next(new AppError('Company not found', 404));
    }
    // Check if the authenticated user is the company HR
    if(company.companyHR.toString() !== req.user._id.toString()) {
        return next(new AppError('Only the company owner can delete the data', 403));
    }
    // Find all jobs added by the company HR
    const jobs = await Job.find({ addedBy: company.companyHR });
    const jobIds = jobs.map(job => job._id);
    // Delete all jobs added by the company HR
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
/**
 * @desc Get a company and its jobs
 * @route GET /company/specific/:id
 * @access Public
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {String} req.params.id - Company ID
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const getCompany = async (req, res, next) => {
    // Extract the company ID from the request parameters
    const companyId = req.params.id
    // Find the company by ID in the database and exclude the __v field
    const company = await Company.findById(companyId).select('-__v');
    // If the company is not found, return a 404 error
    if(!company) {
        return next(new AppError('Company not found', 404));
    }
    // Find all jobs added by the company HR
    const jobs = await Job.find({ addedBy: { $in: company.companyHR } });
    // Convert the company document to a object and add the jobs field
    const companyData = company.toObject();
    companyData.jobs = jobs;
     // Send a success response with the company data including its jobs
    return res.status(200).json({ data: companyData });
}
/**
 * @desc Search for companies by name
 * @route GET /company/search
 * @access Public
 * @param {Object} req - Express request object
 * @param {Object} req.query - Request query parameters
 * @param {String} req.query.q - Search query
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const searchCompany = async (req, res, next) => {
    // Extract the search query from the request query parameters
    const query = req.query.q;
    // Find companies whose name matches the search query (case-insensitive)
    const companies = await Company.find({ companyName: { $regex: query, $options: 'i' } });
    // If no companies are found, return a 404 error
    if (!companies.length) {
        return next(new AppError('No companies found with that name', 404));
    }
    // Send a success response with the found companies
    return res.status(200).json({ data: companies });
}
/**
 * @desc Get applications for a specific job
 * @route GET /job/:jobId/applications
 * @access Private
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {String} req.params.jobId - Job ID
 * @param {Object} req.user - Authenticated user
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const getApplications = async (req, res, next) => {
    // Extract the job ID from the request parameters
    const { jobId } = req.params;
    const userId = req.user._id; // This is the company owner's ID
    // Find the job by ID in the database
    const job = await Job.findById(jobId);
    // If the job is not found, return a 404 error
    if (!job) {
        return next(new AppError('Job not found', 404));
    }
    // Check if the authenticated user is the owner of the job
    if (job.addedBy.toString() !== userId.toString()) {
        return next(new AppError('You do not have permission to view applications for this job', 403));
    }
    // Find all applications for the job and populate the user details
    const applications = await Application.find({ jobId }).populate('userId');
    // Format the applications with necessary details
    const formattedApplications = applications.map(app => ({
        _id: app._id,
        jobId: app.jobId,
        userTechSkills: app.userTechSkills,
        userSoftSkills: app.userSoftSkills,
        userResume: app.userResume,
        user: app.userId 
    }));
    // Send a success response with the found applications
    res.status(200).json({
        message: 'Applications retrieved successfully',
        data: formattedApplications
    });
}