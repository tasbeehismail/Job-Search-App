import Job from '../models/job.js';
import AppError from '../utils/appError.js';
import Application from '../models/application.js';

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

    await job.deleteOne(job._id);
    return res.status(200).json({ message: 'Job deleted successfully' });
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