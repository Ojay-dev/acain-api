import Joi from '@hapi/joi';
import format from '.';
import validator from '../utils/validator';

/** class that validates events */
class EventsValidation {
  /**
   * validates event creation
   * @param {object} req request object
   * @param {object} res response object
   * @param {function} next next middleware
   * @return {function} validator function
   */
  static validateEventCreation(req, res, next) {
    const schema = Joi.object().keys({
      eventDate: Joi.date().required(),
      venue: Joi.string().required(),
      note: Joi.string(),
      description: format.pubDescription.required()
    });
    return validator(schema, req.body, res, next);
  }

  /**
   * validates event update
   * @param {object} req request object
   * @param {object} res response object
   * @param {function} next next middleware
   * @return {function} validator function
   */
  static validateEventUpdate(req, res, next) {
    const schema = Joi.object().keys({
      eventDate: Joi.date(),
      venue: Joi.string(),
      note: Joi.string(),
      description: format.pubDescription
    });
    return validator(schema, req.body, res, next);
  }
}

export default EventsValidation;
