import Joi from '@hapi/joi';
import validator from '../utils/validator';
import format from '.';

/** class that handles validation for board members */
class BoardMemberValidation {
  /**
   * validate board member creation
   * @param {object} req request object
   * @param {object} res response object
   * @param {function} next next middleware
   * @return {function} validator function
   */
  static validateBoardMemberCreation(req, res, next) {
    const schema = Joi.object().keys({
      username: format.username.required(),
      email: format.email.required(),
      name: format.name.required(),
      password: format.password,
      phone: format.phone.required(),
      about: format.pubDescription
    });

    return validator(schema, req.body, res, next);
  }
}

export default BoardMemberValidation;
