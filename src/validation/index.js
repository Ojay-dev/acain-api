/* eslint-disable newline-per-chained-call */
import Joi from '@hapi/joi';

export default {
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: true }
    })
    .trim()
    .required(),
  username: Joi.string()
    .regex(/^(?=.{4,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/)
    .message(
      'username must be 4 to 20 characters long and should contain no spaces'
    ),
  password: Joi.string()
    .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?.&])[A-Za-z\d@$!%*.#?&]{8,20}$/)
    .message(
      'password must be 8-20 characters long, and must contain at least one letter, one number and one special character'
    ),
  name: Joi.string()
    .regex(/^[a-zA-Z.]{2,}(?: [a-zA-Z]+){0,2}$/)
    .message(
      'name should be at least 4 characters long'
    ),
  phone: Joi.string()
    .regex(/^\+[1-9]{1,3}[0-9]{3,14}$/)
    .message('input phone number with country code. ex, +234...'),
  pubTitle: Joi.string().min(4),
  pubDescription: Joi.string().min(20),
  profession: Joi.alternatives(
    Joi.object().keys({
      isIllustrator: Joi.boolean().required()
    }),
    Joi.object().keys({
      isAuthor: Joi.boolean().required()
    }),
    Joi.object().keys({
      isIllustrator: Joi.boolean(),
      isAuthor: Joi.boolean()
    })
  ),
  address: Joi.string(),
  membershipType: Joi.string()
    .regex(/(associate_membership|full_membership)/)
    .message(
      'value can only be one of associate_membership and full_membership'
    )
};
