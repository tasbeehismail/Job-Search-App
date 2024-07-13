
class AppError extends Error {
    constructor(message, statusCode, data) {
        super(message);
        this.statusCode = statusCode;
        if(data){
            this.data = data
        }
    }
}

export default AppError