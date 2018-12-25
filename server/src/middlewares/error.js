
const httpStatus = require('http-status');

module.exports = (err, req, res, next) => {
  const response = {
    message: err.message || httpStatus[err.status],
    stack: err.stack,
    success: false,
    status: err.status || 500
  };
  req.logger.info('Send error');
  res.status(response.status);
  res.json(response);
  res.end();
};