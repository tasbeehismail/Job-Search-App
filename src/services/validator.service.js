import AppError from "../utils/appError.js";
/**
 * @description Middleware function to validate incoming data using a Joi schema.
 * @param {object} schema - The Joi schema to validate against.
 * @returns {function} Express middleware function that will validate incoming data.
 */
export const validate = (schema) => (req, res, next) => {
    // Combine all data from the request body, query, and params into one object.
    const allData = { ...req.body, ...req.query, ...req.params };
    // Validate the data.
    const { error } = schema.validate(allData, { abortEarly: false });
    if (error) {
        // If there are validation errors, extract the details of each error and return a 400 error with the details.
        const errors = error.details.map((detail) => ({
            field: detail.path[0],
            message: detail.message,
        }));
        return next(new AppError('Validation error', 400, errors));
    }else return next();
};
