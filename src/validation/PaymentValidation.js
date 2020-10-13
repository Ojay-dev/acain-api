import Joi from '@hapi/joi';

import format from '.';
import validator from '../utils/validator';

/** class that handles payment validation */
class PaymentValidation {
  /**
   * validates payment request
   * @param {object} req request object
   * @param {object} res response object
   * @param {function} next next middleware
   * @return {function} validator function
   */
  static validatePaymentCreation(req, res, next) {
    const schema = Joi.object().keys(
      {
        membershipType: format.membershipType.required()
      }
    );

    return validator(schema, req.body, res, next);
  }

  /**
   * validate payment verification
   * @param {object} req request object
   * @param {object} res response object
   * @param {function} next next middleware
   * @return {function} validator function
   */
  static validatePaymentVerification(req, res, next) {
    const schema = Joi.object().keys(
      {
        transRef: Joi.string().required(),
        transID: Joi.string().required()
      }
    );

    return validator(schema, req.body, res, next);
  }
}

export default PaymentValidation;
