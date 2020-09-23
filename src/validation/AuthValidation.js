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
      phone: format.phone.required(),
      about: format.pubDescription
    });
    return validator(schema, req.body, res, next);
  }

  /**
   * Validates signin
   * @param {object} req request object
   * @param {object} res response object
   * @param {function} next next middleware
   * @returns {function} validation function
   */
  static validateSignIn(req, res, next) {
    const schema = Joi.object().keys({
      email: format.email.required(),
      password: Joi.string().required()
    });
    return validator(schema, req.body, res, next);
  }

  /**
   * Validates verification code resend
   * @param {object} req request object
   * @param {object} res response object
   * @param {function} next next middleware
   * @returns {function} validation function
   */
  static validateVerificationResend(req, res, next) {
    const schema = Joi.alternatives(
      Joi.object().keys({
        type: Joi.string().regex(/phone/).required(),
        phone: format.phone.required()
      }),
      Joi.object().keys({
        type: Joi.string()
          .regex(/(email|password)/)
          .required(),
        email: format.email.required()
      })
    );
    return validator(schema, req.body, res, next);
  }

  /**
   * Validates password change from code
   * @param {object} req request object
   * @param {object} res response object
   * @param {function} next next middleware
   * @returns {function} validation function
   */
  static validatePasswordChangeFromCode(req, res, next) {
    const schema = Joi.object().keys({
      password: format.password.required(),
      confirmPassword: format.password.required()
    });
    return validator(schema, req.body, res, next);
  }
}

export default AuthValidation;
