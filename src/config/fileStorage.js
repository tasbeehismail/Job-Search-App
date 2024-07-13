import multer from 'multer';
import { v4 as uuid } from 'uuid';
import AppError from '../utils/appError.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, uuid() + '-' + file.originalname);
  }
});

const fileFilter = (fieldName) => {
  return (req, file, cb) => {
    if (file.mimetype.startsWith('application/pdf')) {
      cb(null, true);
    } else {
      cb(new AppError(`Not an ${fieldName}! Please upload only ${fieldName}.`, 400), false);
    }
  };
};

export { storage, fileFilter };
