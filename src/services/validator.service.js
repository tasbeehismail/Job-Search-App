import AppError from "../utils/appError.js";
export const validate = (schema) => (req, res, next) => {
    const allData = { ...req.body, ...req.query, ...req.params };
    const { error } = schema.validate(allData, { abortEarly: false });
    if (error) {
        const errors = error.details.map((detail) => ({
            field: detail.path[0],
            message: detail.message,
          }));        

          return next(new AppError('Validation error', 400, errors));
    }else return next();
};
