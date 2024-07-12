import { upload } from './uploadService.js';

const uploadSingleFile = (fieldName) => upload(fieldName, false);

const uploadManyFiles = (fieldName) => upload(fieldName, true);

export { uploadSingleFile, uploadManyFiles };
