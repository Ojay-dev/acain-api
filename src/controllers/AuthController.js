import AuthService from '../services/AuthService';
import Response from '../utils/response';

/** class that handles authentication controller */
class AuthController {
  /**
   * Creates a single user
   * @param {object} req request object
   * @param {object} res response object
   * @param {function} next next middleware
   * @returns {Response} Http response
   */
  static async createSingleUser(req, res, next) {
    try {
      const user = await AuthService.createSingleUser(req.body);
      return Response.customResponse(
        res,
        201,
        'user created successfully',
        user
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Signs in user
   * @param {object} req request object
   * @param {object} res response object
   * @param {function} next next middleware
   * @returns {Response} Http response
   */
  static async signInUser(req, res, next) {
    try {
      const user = await AuthService.authenticateSingleUser(req.body);
      return Response.customResponse(
        res,
        200,
        'authentication successful',
        user
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * resends a verification code to user's email
   * @param {object} req request object
   * @param {object} res response object
   * @param {function} next next middleware
   * @returns {Response} Http response
   */
  static async resendVerificationEmail(req, res, next) {
    try {
      if (req.body.type === 'phone') {
        return Response.badRequestError(res, 'we currently cant verify phones');
      }
      const verification = await AuthService.resendVerification(req.body.email);
      return Response.customResponse(
        res,
        200,
        'verification code has been sent to your email',
        verification
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * verifies a user's email
   * @param {object} req request object
   * @param {object} res response object
   * @param {function} next next middleware
   * @returns {Response} Http response
   */
  static async verifyUserEmail(req, res, next) {
    try {
      const { code = '' } = req.query;
      await AuthService.verifyUserEmail(code);
      Response.customResponse(res, 200, 'email verified', true);
    } catch (error) {
      next(error);
    }
  }

  /**
   * sends a forgot password email
   * @param {object} req request object
   * @param {object} res response object
   * @param {function} next next middleware
   * @returns {Response} Http response
   */
  static async forgotPassword(req, res, next) {
    try {
      await AuthService.forgotPassword(req.body.email);
      Response.customResponse(res, 200, 'password reset sent', true);
    } catch (error) {
      next(error);
    }
  }

  /**
   * changes password from code
   * @param {object} req request object
   * @param {object} res response object
   * @param {function} next next middleware
   * @returns {Response} Http response
   */
  static async changePasswordFromCode(req, res, next) {
    try {
      const { code = '' } = req.query;
      await AuthService.changePasswordFromCode(code, req.body);
      Response.customResponse(res, 200, 'password changed', true);
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
