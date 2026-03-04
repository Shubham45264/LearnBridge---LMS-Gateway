// Custom error class
export class AppError extends Error {
    constructor(message, statusCode, errors = []) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        this.errors = errors;

        Error.captureStackTrace(this, this.constructor);
    }
}

// Error handler for async functions
export const catchAsync = (fn) => {
    if (typeof fn !== 'function') {
        console.error("CATCH ASYNC RECEIVED NON-FUNCTION:", fn);
    }
    return (req, res, next) => {
        if (typeof next !== 'function') {
            console.error("NEXT IS NOT A FUNCTION IN CATCH ASYNC WRAPPER");
        }
        Promise.resolve(fn(req, res, next)).catch((err) => {
            console.error("CATCH ASYNC CAUGHT ERROR:", {
                message: err.message,
                stack: err.stack
            });
            if (typeof next === 'function') {
                next(err);
            } else {
                console.error("CANNOT CALL NEXT(ERR) - NEXT IS NOT A FUNCTION");
                res.status(500).json({ status: 'error', message: err.message });
            }
        });
    };
};

// Global error handling middleware
export const errorHandler = (err, req, res, next) => {
    console.error("GLOBAL ERROR HANDLER TRIGGERED");
    console.error("Error Type:", typeof err);
    console.error("Error Name:", err.name);
    console.error("Error Message:", err.message);
    if (err.stack) console.error("Error Stack:", err.stack);

    // Ensure we don't crash the error handler itself
    try {
        const statusCode = err.statusCode || 500;
        const status = err.status || 'error';

        res.status(statusCode).json({
            status: status,
            message: err.message || 'Internal Server Error',
            ...(process.env.NODE_ENV === 'development' && {
                stack: err.stack,
                error: err,
                debugInfo: "Enhanced Error Handler"
            })
        });
    } catch (handlerError) {
        console.error("CRITICAL ERROR IN ERROR HANDLER:", handlerError);
        if (!res.headersSent) {
            res.status(500).json({ status: 'error', message: 'Critical error in error handler' });
        }
    }
};

export const handleMongoError = (err) => err;
export const handleJWTError = () => new AppError('Invalid token', 401);
export const handleJWTExpiredError = () => new AppError('Token expired', 401);
