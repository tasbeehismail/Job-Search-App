import multer from 'multer';
import { storage, fileFilter } from '../config/fileStorage.js';

// This function handles file upload using multer
// Parameters: 
// - fieldName: the name of the field for the file input
// - isMultiple: flag to determine if multiple files can be uploaded

 const upload = (fieldName, isMultiple = false) => { 
  // Create a multer instance with specified configurations
   const multerInstance = multer({
    storage, // Storage configuration for saving files
    limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 2MB
    fileFilter: fileFilter(fieldName) // Filter files based on file type
   });
 
 // Return either single file upload or multiple file uploads based on isMultiple flag
   return isMultiple ? multerInstance.array(fieldName, 10) : multerInstance.single(fieldName);
};


export { upload };
