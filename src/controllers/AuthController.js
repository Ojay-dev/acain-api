import AuthService from '../services/AuthService';
import Response from '../utils/response';

/** class that handles authentication controller */
class AuthController {
  /**
   * Creates a single user
   * @param {object} req request object
   * @param {object} res response object
   * @param {function} next next middleware
   * @returns {function} middleware function
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
}

export default AuthController;
