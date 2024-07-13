import { upload } from '../services/upload.service.js';

const uploadSingleFile = (fieldName) => upload(fieldName, false);

const uploadManyFiles = (fieldName) => upload(fieldName, true);

export { uploadSingleFile, uploadManyFiles };
