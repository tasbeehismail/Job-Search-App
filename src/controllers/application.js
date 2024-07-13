import ExcelJS from 'exceljs';
import moment from 'moment';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Application from '../models/application.js';
import Job from '../models/job.js';
import Company from '../models/company.js';
// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Gets all the applications for a given company on a given date.
 * It will return an Excel file with the applications.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const getApplicationsForCompany = async (req, res) => {
    const { companyId, date } = req.params;
    const startOfDay = moment(date).startOf('day').toDate();
    const endOfDay = moment(date).endOf('day').toDate();
    
    // Find the company and the jobs added by the company HR
    const company = await Company.findById(companyId);
    const companyHR = company.companyHR;
    const companyJobs = await Job.find({ addedBy: companyHR });
    const jobIds = companyJobs.map(job => job._id);

    // Find all the applications for the jobs added by the company HR
    // on the given date
    const applications = await Application.find({
        jobId: { $in: jobIds },
        createdAt: { $gte: startOfDay, $lte: endOfDay }
    }).populate('userId jobId');

    // Create a new Excel workbook and add a worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Applications');

    // Set the columns of the worksheet
    worksheet.columns = [
        { header: 'User Name', key: 'userName', width: 30 },
        { header: 'User Email', key: 'userEmail', width: 30 },
        { header: 'Job Title', key: 'jobTitle', width: 30 },
        { header: 'Tech Skills', key: 'techSkills', width: 50 },
        { header: 'Soft Skills', key: 'softSkills', width: 50 },
        { header: 'Resume Link', key: 'resumeLink', width: 80 }
    ];

    // Add the applications to the worksheet
    applications.forEach(application => {
        worksheet.addRow({
            userName: `${application.userId.firstName} ${application.userId.lastName}`,
            userEmail: application.userId.email,
            jobTitle: application.jobId.jobTitle,
            techSkills: application.userTechSkills.join(', '),
            softSkills: application.userSoftSkills.join(', '),
            resumeLink: application.userResume
        });
    });

    // Create the file path for the file
    const fileName = `Applications_${companyId}_${date}.xlsx`;
    const filePath = path.join(__dirname, '../../files', fileName);

    // Ensure the directory exists
    const filesDir = path.join(__dirname, '../../files');
    if (!fs.existsSync(filesDir)) {
        fs.mkdirSync(filesDir, { recursive: true });
    }

    // Save the file to the server
    await workbook.xlsx.writeFile(filePath);

    // Send the file to the client
    res.download(filePath, fileName);
};
