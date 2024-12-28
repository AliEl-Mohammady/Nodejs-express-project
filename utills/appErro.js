class AppError  {
    constructor(message,statusCode,code) {
        this.message = message;
        this.statusCode = statusCode;
        this.code = code
    }

    static create(message, statusCode) {
        return new AppError(message, statusCode);
    }
}

module.exports = AppError;

