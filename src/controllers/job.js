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