import Job from '../models/job.js';
import AppError from '../utils/appError.js';


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

