export const customError = (message, name, status, throwError = true) => {
  const error = new Error(message);
  error.name = name;
  error.status = status;
  if (throwError) {
    throw error;
  }
  return error;
};

/* eslint-disable no-unused-vars */
export default (error, req, res, next) => {
  const status = error.status || 500;
  if (status === 500) {
    console.log(error);
  }
  res.status(status).json({
    message: error.message,
    status,
    error: error.name || 'Server Error'
  });
};
