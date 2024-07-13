import Job from '../models/job.js';
import AppError from '../utils/appError.js';
import Application from '../models/application.js';
import User from '../models/user.js';
import Company from '../models/company.js';
/**
 * @description Add a new job posting
 * @route POST /job/add
 * @access Private
 * @param {object} req - Express request object containing job details
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
export const addJob = async (req, res, next) => {
    const { jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills } = req.body;
    const addedBy = req.user._id;
    // Create a new job document
    const job = await Job.create({ 
        jobTitle,
        jobLocation,
        workingTime,
        seniorityLevel,
        jobDescription,
        technicalSkills,
        softSkills,
        addedBy
    });
    // Send a success response
    return res.status(200).json({ message: 'Job added successfully', data: job });
}
/**
 * @description Update an existing job posting
 * @route PATCH /job/update/:id
 * @access Private
 * @param {object} req - Express request object containing job updates
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
export const updateJob = async (req, res, next) => {
    const jobId = req.params.id
    // Find the job by ID
    const job = await Job.findById({ _id: jobId });
    // Check if job exists
    if(!job) {
        return next(new AppError('Job not found', 404));
    }
    // Check if the current user is the owner of the job
    if(job.addedBy.toString() !== req.user._id.toString()) {
        return next(new AppError('Only the job owner can update the data', 403));
    }
    // Update job fields
    const { jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills } = req.body;
    job.jobTitle = jobTitle || job.jobTitle;
    job.jobLocation = jobLocation || job.jobLocation;
    job.workingTime = workingTime || job.workingTime;
    job.seniorityLevel = seniorityLevel || job.seniorityLevel;
    job.jobDescription = jobDescription || job.jobDescription;
    job.technicalSkills = technicalSkills || job.technicalSkills;
    job.softSkills = softSkills || job.softSkills;
    // Save the updated job
    await job.save();
    // Send a success response
    return res.status(200).json({ message: 'Job updated successfully', data: job });
}

/**
 * @description Delete a job posting
 * @route DELETE /job/delete/:id
 * @access Private
 * @param {object} req - Express request object containing job ID
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
export const deleteJob = async (req, res, next) => {
    const jobId = req.params.id
    // Find the job by ID
    const job = await Job.findById({ _id: jobId });
    // Check if job exists
    if(!job) {
        return next(new AppError('Job not found', 404));
    }
    // Check if the current user is the owner of the job
    if(job.addedBy.toString() !== req.user._id.toString()) {
        return next(new AppError('Only the job owner can delete the data', 403));
    }
    // Delete all applications related to this job
    await Application.deleteMany({ jobId: job._id });
    // Delete the job
    await job.deleteOne(job._id);
    // Send a success response
    return res.status(200).json({ message: 'Job and related applications deleted successfully' });
}
/**
 * @description Get all job postings
 * @route GET /job/all
 * @access Public
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
export const getAllJobs = async (req, res, next) => {
  // Retrieve all jobs and populate addedBy field with user information
    const jobs = await Job.find()
      .populate({
        path: 'addedBy',
        model: 'User',
      });
    // Check if jobs exist  
    if (!jobs.length) {
      return next(new AppError('No jobs found', 404));
    }
    // Add company information to each job
    const jobsWithCompanyInfo = await Promise.all(
      jobs.map(async (job) => {
        const company = await Company.findOne({ companyHR: job.addedBy._id });
        return {
          _id: job._id,
          jobTitle: job.jobTitle,
          jobLocation: job.jobLocation,
          workingTime: job.workingTime,
          seniorityLevel: job.seniorityLevel,
          jobDescription: job.jobDescription,
          technicalSkills: job.technicalSkills,
          softSkills: job.softSkills,
          addedBy: {
            name: job.addedBy.firstName + ' ' + job.addedBy.lastName,
            email: job.addedBy.email
          },
          company: {
            companyName: company.companyName,
            description: company.description,
            industry: company.industry,
            address: company.address,
            numberOfEmployees: company.numberOfEmployees,
            companyEmail: company.companyEmail
          }
        };
      })
    );
    // Send a success response
    return res.status(200).json({ message: 'Jobs retrieved successfully', data: jobsWithCompanyInfo });

}
/**
 * @description Get job postings by company name
 * @route GET /job/company
 * @access Public
 * @param {object} req - Express request object containing company name query
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
export const getJobsByCompanyName = async (req, res, next) => {
    const q = req.query.q;
    // Find the company by name
    const company = await Company.findOne({ companyName: q });
    // Check if company exists
    if (!company) {
        return next(new AppError(`Company with name "${q}" not found.`, 404));
    }
    // Find users (HRs) associated with the company
    const users = await User.find({ _id: company.companyHR })
    // Check if HR users exist for the company
    if (users.length === 0) {
        return next(new AppError(`No HR users found for company "${q}".`, 404));
    }
    // Find jobs added by HR users
    const jobs = await Job.find({ addedBy: { $in: users.map(user => user._id) } })
        .populate({
        path: 'addedBy',
        model: 'User',
        select: 'firstName lastName email'
    })
    // Check if jobs exist
    if (!jobs.length) {
        return next(new AppError('No jobs found with that name', 404));
    }
     // Format jobs with company information
    const formattedJobs = jobs.map(job => ({
        _id: job._id,
        jobTitle: job.jobTitle,
        jobLocation: job.jobLocation,
        workingTime: job.workingTime,
        seniorityLevel: job.seniorityLevel,
        jobDescription: job.jobDescription,
        technicalSkills: job.technicalSkills,
        softSkills: job.softSkills,
        addedBy: {
          name: job.addedBy.firstName + ' ' + job.addedBy.lastName,
          email: job.addedBy.email
        },
        company: {
          companyName: company.companyName,
          description: company.description,
          industry: company.industry,
          address: company.address,
          numberOfEmployees: company.numberOfEmployees,
          companyEmail: company.companyEmail
        }
      }));

    return res.status(200).json({ data: formattedJobs });
}
/**
 * @description Get job postings by filters
 * @route GET /job/filter
 * @access Public
 * @param {object} req - Express request object containing job filters
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
export const getJobsByFilters = async (req, res, next) => {
    const { workingTime, jobLocation, seniorityLevel, jobTitle, technicalSkills } = req.query;

    const filter = {};
    // Check if every filter is provided in the query and add it to the filter object
    workingTime ? filter.workingTime = workingTime : null;
    jobLocation ? filter.jobLocation = jobLocation : null;
    seniorityLevel ? filter.seniorityLevel = seniorityLevel : null;
    jobTitle ? filter.jobTitle = jobTitle : null;
    if (technicalSkills) {
      // Ensure technicalSkills is an array; if not, convert it to an array
        if (!Array.isArray(technicalSkills)) {
            technicalSkills = [technicalSkills];
        }
        // Add technicalSkills to the filter object using the $all operator to match all elements in the array
        filter.technicalSkills = { $all: technicalSkills };
    }
    // Check if any filter is provided
    if (!Object.keys(filter).length) {
        return next(new AppError('No filters provided. Please provide at least one filter.', 400));
    }
    // Find jobs with the provided filters
    const jobs = await Job.find({ ...filter });
    // Check if jobs exist
    if(!jobs.length) {
        return next(new AppError('No jobs found with that filter', 404));
    }
    return res.status(200).json({ message: 'Jobs retrieved successfully', data: jobs });
}
/**
 * @description Apply for a job
 * @route POST /job//apply/:jobId
 * @access Private
 * @param {object} req - Express request object containing job application details
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
export const applyJob = async (req, res, next) => {
    const { jobId } = req.params;
    const userId = req.user._id;
    const { userTechSkills, userSoftSkills } = req.body;
    // Check if file is uploaded
    if (!req.file) {
        return next(new AppError('No file uploaded', 400));
    }
    const userResume = req.file.filename;
    // Create a new job application
    const newApplication = new Application({
      jobId,
      userId,
      userTechSkills,
      userSoftSkills,
      userResume
    });
     // Save the application
    await newApplication.save();
    // Send a success response
    res.status(201).json({
        message: "Application submitted successfully",
        data: {
            application: newApplication
        }
    });
  };