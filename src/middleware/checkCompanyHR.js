import AppError from "../utils/appError.js";
export const checkCompanyHR = async (req, res, next) => {
    const user = req.user; 
    
    if (user.role === 'Company_HR') {
      next(); 
    } else {
        next(new AppError('You are not authorized to perform this action', 403));
    }
  };
  