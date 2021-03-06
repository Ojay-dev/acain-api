/* eslint-disable object-curly-newline */
/* eslint-disable no-underscore-dangle */
/* eslint-disable operator-linebreak */

import ProfileService from '../services/ProfileService';
import Response from '../utils/response';
import { uploadFile } from '../utils/util';

/** class that handles profile controller */
class ProfileController {
  /**
   * Returns user's profile information
   * @param {object} req request object
   * @param {object} res resonse object
   * @returns {Response} HTTP Response
   */
  static getSingleUserProfile(req, res) {
    Response.customResponse(res, 200, 'user profile', req.user.toJSON());
  }

  /**
   * Updates user's basic info: name,
   * twitter, facebook, and linkedIn
   * @param {object} req request object
   * @param {object} res resonse object
   * @param {function} next next middleware
   * @returns {Response} HTTP Response
   */
  static async updateBasicInfo(req, res, next) {
    try {
      const user = await ProfileService.updateBasicProfile(req.user, req.body);
      Response.customResponse(res, 200, 'profile updated', user);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Updates user's username
   * @param {object} req request object
   * @param {object} res resonse object
   * @param {function} next next middleware
   * @returns {Response} HTTP Response
   */
  static async updateUsername(req, res, next) {
    try {
      const user = await ProfileService.updateUsername(
        req.user,
        req.body.username
      );
      Response.customResponse(res, 200, 'username changed', user);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Updates user's email
   * @param {object} req request object
   * @param {object} res resonse object
   * @param {function} next next middleware
   * @returns {Response} HTTP Response
   */
  static async updateEmail(req, res, next) {
    try {
      const user = await ProfileService.updateEmail(req.user, req.body.email);
      Response.customResponse(
        res,
        200,
        'email changed. Go to your inbox and verify your email',
        user
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Updates user's password
   * @param {object} req request object
   * @param {object} res resonse object
   * @param {function} next next middleware
   * @returns {Response} HTTP Response
   */
  static async updatePassword(req, res, next) {
    try {
      const user = await ProfileService.updatePassword(req.user, req.body);
      Response.customResponse(res, 200, 'password changed', user);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Updates user's phone
   * @param {object} req request object
   * @param {object} res resonse object
   * @param {function} next next middleware
   * @returns {Response} HTTP Response
   */
  static async updatePhone(req, res, next) {
    try {
      const user = await ProfileService.updatePhone(req.user, req.body.phone);
      Response.customResponse(res, 200, 'phone changed', user);
    } catch (error) {
      next(error);
    }
  }

  /**
   * updates user's avatar
   * @param {object} req request object
   * @param {object} res resonse object
   * @param {function} next next middleware
   * @returns {Response} HTTP Response
   */
  static async updateAvatar(req, res, next) {
    try {
      const result = await uploadFile(req, 'avatar', {
        transformation: [
          { width: 500, height: 500, gravity: 'face', crop: 'thumb' }
        ],
        public_id: `avatars/${req.user._id}`,
        format: 'png'
      });
      const user = await ProfileService.updateBasicProfile(req.user, {
        avatar: result.url
      });
      return Response.customResponse(res, 200, 'avatar updated', user);
    } catch (error) {
      next(error);
    }
  }
}

export default ProfileController;
