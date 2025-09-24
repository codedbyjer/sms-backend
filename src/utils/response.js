const successResponse = (res, statusCode, message, data = {}) => {
    return res.status(statusCode).json({
        success: true,
        statusCode,
        message,
        data
    });
};


const errorResponse = (res, statusCode, message, error = {}) => {
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        error
    });
};


module.exports = { successResponse, errorResponse };