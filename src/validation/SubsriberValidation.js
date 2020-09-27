import Joi from '@hapi/joi';
import format from '.';
import validator from '../utils/validator';

/** class that validates subscritions */
class SubscriberValidation {
  /**
   * validates subscription and unsubscription
   * @param {object} req request object
   * @param {object} res response object
   * @param {function} next next middleware
   * @return {function} validator function
   */
  static validateSubs(req, res, next) {
    const schema = Joi.object().keys({
      email: format.email.required()
    });
    return validator(schema, req.body, res, next);
  }
}

export default SubscriberValidation;
