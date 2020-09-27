import Joi from '@hapi/joi';
import format from '.';
import validator from '../utils/validator';

/** class that validates subscritions */
class ContactValidation {
  /**
   * validates contact message creation
   * @param {object} req request object
   * @param {object} res response object
   * @param {function} next next middleware
   * @return {function} validator function
   */
  static validateContact(req, res, next) {
    const schema = Joi.object().keys({
      email: format.email.required(),
      name: format.name.required(),
      organization: Joi.string().required(),
      phone: format.phone.required(),
      message: Joi.string().required()
    });
    return validator(schema, req.body, res, next);
  }
}

export default ContactValidation;
