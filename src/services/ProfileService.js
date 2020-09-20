/* eslint-disable no-underscore-dangle */
import _ from 'lodash';

import { customError } from '../errors';
import User from '../models/User';
import { duplicateCheck } from '../utils/util';
import AuthService from './AuthService';

/** class that handles profile service */
class ProfileService {
  /**
   * updates basic profile info
   * @param {object} user user object from request object
   * @param {object} update parameters to update user with
   * @return {object} user object
   */
  static async updateBasicProfile(user, update) {
    _.merge(user, update);
    user = await user.save();
    return user.toJSON();
  }

  /**
   * updates username
   * @param {object} user user object from request object
   * @param {string} username new username
   * @return {object} user object
   */
  static async updateUsername(user, username) {
    if (await duplicateCheck(User, { username })) {
      customError('username already in use', 'Bad Request', 400);
    }
    user.username = username;
    user = await user.save();
    return user.toJSON();
  }

  /**
   * updates phone
   * @param {object} user user object from request object
   * @param {string} phone new phone
   * @return {object} user object
   */
  static async updatePhone(user, phone) {
    if (await duplicateCheck(User, { phone })) {
      customError('phone already in use', 'Bad Request', 400);
    }
    user.phone = phone;
    user.phoneIsVerified = false;
    user = await user.save();
    return user.toJSON();
  }

  /**
   * updates emainl
   * @param {object} user user object from request object
   * @param {string} email new email
   * @return {object} user object
   */
  static async updateEmail(user, email) {
    if (await duplicateCheck(User, { email })) {
      customError('email already in use', 'Bad Request', 400);
    }
    user.email = email;
    user.emailIsVerified = false;
    user = await user.save();
    await AuthService.sendVerification(user._id, user.email);
    return user.toJSON();
  }

  /**
   * updates passwrod
   * @param {object} user user object from request object
   * @return {object} user object
   */
  static async updatePassword(
    user,
    { password, newPassword, confirmPassword }
  ) {
    if (newPassword !== confirmPassword) {
      customError('passwords do not match', 'Bad Request', 400);
    }
    if (!(await user.authenticate(password))) {
      customError('incorrect password', 'Authorization Error', 403);
    }
    user.password = newPassword;
    user = await user.save();
    return user.toJSON();
  }
}

export default ProfileService;
