export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  let error = {
    success: false,
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  };

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = {
      success: false,
      message: 'Validation Error',
      errors: message
    };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = {
      success: false,
      message: 'Invalid token'
    };
  }

  if (err.name === 'TokenExpiredError') {
    error = {
      success: false,
      message: 'Token expired'
    };
  }

  // Database errors
  if (err.code === 'SQLITE_CONSTRAINT') {
    error = {
      success: false,
      message: 'Database constraint violation',
      ...(process.env.NODE_ENV === 'development' && { details: err.message })
    };
  }

  // Rate limit errors
  if (err.status === 429) {
    error = {
      success: false,
      message: 'Too many requests',
      retryAfter: err.retryAfter
    };
  }

  // File upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    error = {
      success: false,
      message: 'File too large',
      maxSize: process.env.MAX_FILE_SIZE || '10MB'
    };
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    error = {
      success: false,
      message: 'Unexpected file field'
    };
  }

  // Set status code
  const statusCode = err.statusCode || err.status || 500;
  
  res.status(statusCode).json(error);
};
