export default (err, req, res, next) => {
    //console.error(`Async Handler: ${err.stack}`);
    const code = err.statusCode || 500;
    const response = {
        error: err.message,
        code: code,
        success: false,
    };
    
    if (err.data) {
        response.data = err.data; 
    }
    
    res.status(code).json(response);
};
