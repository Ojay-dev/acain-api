import Joi from '@hapi/joi';
import format from '.';
import validator from '../utils/validator';

/** class that handles profile validation */
class ProfileValidation {
  /**
   * validate basic profile update
   * @param {object} req request object
   * @param {object} res response object
   * @param {function} next next middleware
   * @return {function} validator function
   */
  static validateBasicProfileUpdate(req, res, next) {
    const schema = Joi.object().keys({
      name: format.name,
      facebook: Joi.string(),
      twitter: Joi.string(),
      linkedIn: Joi.string(),
      about: format.pubDescription,
      profession: format.profession.optional(),
      membershipType: format.membershipType.optional()
    });

    return validator(schema, req.body, res, next);
  }

  /**
   * validates username update
   * @param {object} req request object
   * @param {object} res response object
   * @param {function} next next middleware
   * @return {function} validator function
   */
  static validateUsernameUpdate(req, res, next) {
    const schema = Joi.object().keys({
      username: format.username.required()
    });

    return validator(schema, req.body, res, next);
  }

  /**
   * validates email update
   * @param {object} req request object
   * @param {object} res response object
   * @param {function} next next middleware
   * @return {function} validator function
   */
  static validateEmailUpdate(req, res, next) {
    const schema = Joi.object().keys({
      email: format.email.required()
    });

    return validator(schema, req.body, res, next);
  }

  /**
   * validates password update
   * @param {object} req request object
   * @param {object} res response object
   * @param {function} next next middleware
   * @return {function} validator function
   */
  static validatePasswordUpdate(req, res, next) {
    const schema = Joi.object().keys({
      password: Joi.string().required(),
      newPassword: format.password.required(),
      confirmPassword: Joi.string().required()
    });

    return validator(schema, req.body, res, next);
  }

  /**
   * validates phone update
   * @param {object} req request object
   * @param {object} res response object
   * @param {function} next next middleware
   * @return {function} validator function
   */
  static validatePhoneUpdate(req, res, next) {
    const schema = Joi.object().keys({
      phone: format.phone.required()
    });

    return validator(schema, req.body, res, next);
  }
}

export default ProfileValidation;
