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
    const user = (await User.create(data)).toObject();
    user.access_token = signToken(user._id);
    //  TODO: Send user verification email
    return user;
  }
}

export default AuthService;
