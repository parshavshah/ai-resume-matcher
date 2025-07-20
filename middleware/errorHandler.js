// Global error handling middleware

export const errorHandler = (err, req, res, next) => {
  console.error('Global error:', err);

  // Handle different types of errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message
    });
  }

  if (err.name === 'MulterError') {
    return res.status(400).json({
      error: 'File Upload Error',
      message: err.message
    });
  }

  // Default error response
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong on the server'
  });
};

export default errorHandler; 