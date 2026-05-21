class ResponseHandler {
  static success(res, data = null, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    });
  }

  static error(res, message = 'Error occurred', statusCode = 500, errors = null) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
      timestamp: new Date().toISOString()
    });
  }

  static paginated(res, data, page, limit, total, message = 'Success') {
    const totalPages = Math.ceil(total / limit);
    const currentPage = parseInt(page);
    
    return res.status(200).json({
      success: true,
      message,
      data,
      pagination: {
        currentPage,
        limit: parseInt(limit),
        total,
        totalPages,
        hasNext: currentPage < totalPages,
        hasPrev: currentPage > 1
      },
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = ResponseHandler;