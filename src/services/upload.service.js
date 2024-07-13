import multer from 'multer';
import { storage, fileFilter } from '../config/fileStorage.js';

const upload = (fieldName, isMultiple = false) => {
  const multerInstance = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: fileFilter(fieldName)
  });

  return isMultiple ? multerInstance.array(fieldName, 10) : multerInstance.single(fieldName);
};

export { upload };
