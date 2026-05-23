function Error_handler(err, req, res, next) {
    const Status_code = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error("DEBUG ERROR STACK:", err);
    res.status(Status_code).json({
        success: false,
        Status_Code: Status_code,
        message: message,
        stack: err.stack,
    });
}

export default Error_handler;