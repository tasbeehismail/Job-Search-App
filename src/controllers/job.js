import Job from '../models/job.js';
import AppError from '../utils/appError.js';
import Application from '../models/application.js';
import User from '../models/user.js';
import Company from '../models/company.js';

export const addJob = async (req, res, next) => {
    const { jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills } = req.body;
    const addedBy = req.user._id;

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
    return res.status(200).json({ message: 'Job added successfully', data: job });
}

export const updateJob = async (req, res, next) => {
    const jobId = req.params.id
    const job = await Job.findById({ _id: jobId });
    if(!job) {
        return next(new AppError('Job not found', 404));
    }
    if(job.addedBy.toString() !== req.user._id.toString()) {
        return next(new AppError('Only the job owner can update the data', 403));
    }

    const { jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills } = req.body;
    job.jobTitle = jobTitle || job.jobTitle;
    job.jobLocation = jobLocation || job.jobLocation;
    job.workingTime = workingTime || job.workingTime;
    job.seniorityLevel = seniorityLevel || job.seniorityLevel;
    job.jobDescription = jobDescription || job.jobDescription;
    job.technicalSkills = technicalSkills || job.technicalSkills;
    job.softSkills = softSkills || job.softSkills;
    await job.save();

    return res.status(200).json({ message: 'Job updated successfully', data: job });
}

export const deleteJob = async (req, res, next) => {
    const jobId = req.params.id
    const job = await Job.findById({ _id: jobId });
    if(!job) {
        return next(new AppError('Job not found', 404));
    }
    if(job.addedBy.toString() !== req.user._id.toString()) {
        return next(new AppError('Only the job owner can delete the data', 403));
    }

    await Application.deleteMany({ jobId: job._id });
    await job.deleteOne(job._id);
    return res.status(200).json({ message: 'Job and related applications deleted successfully' });
}

export const getAllJobs = async (req, res, next) => {
    const jobs = await Job.find()
      .populate({
        path: 'addedBy',
        model: 'User',
      });

    if (!jobs.length) {
      return next(new AppError('No jobs found', 404));
    }
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

    return res.status(200).json({ message: 'Jobs retrieved successfully', data: jobsWithCompanyInfo });

}

export const getJobsByCompanyName = async (req, res, next) => {
    const q = req.query.q;

    const company = await Company.findOne({ companyName: q });
    if (!company) {
        return next(new AppError(`Company with name "${q}" not found.`, 404));
    }

    const users = await User.find({ _id: company.companyHR })
    if (users.length === 0) {
        return next(new AppError(`No HR users found for company "${q}".`, 404));
    }

    const jobs = await Job.find({ addedBy: { $in: users.map(user => user._id) } })
        .populate({
        path: 'addedBy',
        model: 'User',
        select: 'firstName lastName email'
    })
    if (!jobs.length) {
        return next(new AppError('No jobs found with that name', 404));
    }

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

export const getJobsByFilters = async (req, res, next) => {
    const { workingTime, jobLocation, seniorityLevel, jobTitle, technicalSkills } = req.query;

    const filter = {};
    workingTime ? filter.workingTime = workingTime : null;
    jobLocation ? filter.jobLocation = jobLocation : null;
    seniorityLevel ? filter.seniorityLevel = seniorityLevel : null;
    jobTitle ? filter.jobTitle = jobTitle : null;
    if (technicalSkills) {
        if (!Array.isArray(technicalSkills)) {
            technicalSkills = [technicalSkills];
        }
        filter.technicalSkills = { $all: technicalSkills };
    }

    if (!Object.keys(filter).length) {
        return next(new AppError('No filters provided. Please provide at least one filter.', 400));
    }
    const jobs = await Job.find({ ...filter });
    if(!jobs.length) {
        return next(new AppError('No jobs found with that filter', 404));
    }
    return res.status(200).json({ message: 'Jobs retrieved successfully', data: jobs });
}

export const applyJob = async (req, res, next) => {
    const { jobId } = req.params;
    const userId = req.user._id;
    const { userTechSkills, userSoftSkills } = req.body;
    if (!req.file) {
        return next(new AppError('No file uploaded', 400));
    }
    const userResume = req.file.filename;
  
    const newApplication = new Application({
      jobId,
      userId,
      userTechSkills,
      userSoftSkills,
      userResume
    });
  
    await newApplication.save();
  
    res.status(201).json({
        message: "Application submitted successfully",
        data: {
            application: newApplication
        }
    });
  };