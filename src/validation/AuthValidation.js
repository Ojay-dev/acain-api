import Joi from '@hapi/joi';
import format from '.';
import validator from '../utils/validator';

/** class that validates auth */
class AuthValidation {
  /**
   * Validates user creation data
   * @param {object} req request object
   * @param {object} res response object
   * @param {function} next next middleware
   * @returns {function} validation function
   */
  static validateUserCreation(req, res, next) {
    const schema = Joi.object().keys({
      username: format.username.required(),
      email: format.email.required(),
      name: format.name.required(),
      password: format.password.required(),
      phone: format.phone.required()
    });
    return validator(schema, req.body, res, next);
  }
}

export default AuthValidation;
