const errorHandler = (err, req, res, next) => {
    console.log(err.stack || err);
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        ...(err.error ? { error: err.error } : {})
    })

}

module.exports = errorHandler;