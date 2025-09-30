const errorHandler = (err, req, res, next) => {
    console.error('[ERROR]', err.stack || err);
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        ...(err.error ? { error: err.error } : {}),
        ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
    })

}

module.exports = errorHandler;