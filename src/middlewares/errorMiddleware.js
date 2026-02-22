const errorHandler = (err, req, res, next) => {
    console.error("❌ Global Error Handler:", err.stack);

    // Default values 
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    if (err.code === 'ER_DUP_ENTRY') {
        statusCode = 400;
        message = "Duplicate Entry: Record already exists.";
    }

    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = "Invalid Token. Please login again.";
    }

    res.status(statusCode).json({
        success: false,
        message: message,
      
        stack: process.env.NODE_ENV === 'development' ? err.stack : null
    });
};

module.exports = errorHandler;