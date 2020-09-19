/* eslint-disable no-underscore-dangle */
import User from '../models/User';
import { signToken } from '../utils/jwtservice';
import { duplicateCheck, parallelRequests } from '../utils/util';
import { customError } from '../errors';

/** class that handles authentication service */
class AuthService {
  /**
   * Creates a new user
   * @param {object} data user data
   * @return {object} user object
   */
  static async createSingleUser(data) {
    const [email, phone, username] = await parallelRequests(
      [duplicateCheck, User, { email: data.email }],
      [duplicateCheck, User, { phone: data.phone }],
      [duplicateCheck, User, { username: data.username }]
    );
    if (email) {
      customError('email is already being used', 'Bad Request', 400);
    }
    if (phone) {
      customError('phone is already being used', 'Bad Request', 400);
    }
    if (username) {
      customError('username is already being used', 'Bad Request', 400);
    }
    const user = (await User.create(data)).toJSON();
    user.access_token = signToken(user._id);
    //  TODO: Send user verification email
    return user;
  }

  /**
   * Authenticates a single user
   * @param {object} param authentication request
   * @return {object} user object if successful
   * throws an error if user cannot be authenticated.
   */
  static async authenticateSingleUser(param) {
    const user = await User.findOne({ email: param.email });
    if (!user || !user.authenticate(param.password)) {
      customError('invalid credentials', 'Authentication Error', 401);
    }
    const token = signToken(user._id);

    return {
      ...user.toJSON(),
      access_token: token
    };
  }
}

export default AuthService;
