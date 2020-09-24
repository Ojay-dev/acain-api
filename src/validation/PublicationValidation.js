import Joi from '@hapi/joi';
import format from '.';
import validator from '../utils/validator';

/** class that handles publication validation */
class PublicationValidation {
  /**
   * validates publication creation
   * @param {object} req request object
   * @param {object} res response object
   * @param {function} next next middleware
   * @return {function} validator function
   */
  static validatePublicationCreation(req, res, next) {
    const schema = Joi.object().keys({
      title: format.pubTitle.required(),
      description: format.pubDescription.required()
    });

    return validator(schema, req.body, res, next);
  }

  /**
   * validates publication update
   * @param {object} req request object
   * @param {object} res response object
   * @param {function} next next middleware
   * @return {function} validator function
   */
  static validatePublicationUpdate(req, res, next) {
    const schema = Joi.object().keys({
      title: format.pubTitle,
      description: format.pubDescription
    });

    return validator(schema, req.body, res, next);
  }
}

export default PublicationValidation;
