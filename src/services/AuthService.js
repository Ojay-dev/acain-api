/* eslint-disable operator-linebreak */
/* eslint-disable no-underscore-dangle */
import User from '../models/User';
import { signToken, verifyToken } from '../utils/jwtservice';
import {
  duplicateCheck,
  parallelRequests,
  sendMail,
  strRandom
} from '../utils/util';
import { customError } from '../errors';
import VerificationCode from '../models/VerificationCode';
import Response from '../utils/response';

const dupCode = (code) => duplicateCheck(VerificationCode, { code });
const createExpire = (time) => {
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + time);
  return expiresAt;
};

/** class that handles authentication service */
class AuthService {
  /**
   * Sends verification code to a user
   * @param {string} _id user id
   * @param {string} email email to send verification to
   * @returns {object} verification code object
   */
  static async sendVerification(_id, email) {
    const code = await strRandom(30, dupCode, true);
    const expiresAt = createExpire(
      parseFloat(process.env.EmailVerificationExpireTime || 1) || 1
    );
    await sendMail(
      email,
      'VERIFY EMAIL WITH ACAIN',
      `
    <div style="text-align: center;"><span style="font-family:verdana,geneva,sans-serif;">
      <p>
          Kindly verify your email address.
      </p>
      <br>
      <p>
          <span><a href="${process.env.EmailVerificationCallback}?code=${code}">${process.env.EmailVerificationCallback}?code=${code}</a></span>
      </p>
      <br>
          We love you!
      <p></p>
      <br><br>
      <span>Regards,</span>
        <p><b>Team.</b></p>
      </span>
    </div>
    `
    );
    await VerificationCode.create({
      code,
      for: 'email',
      userId: _id,
      expiresAt
    });
    return true;
  }

  /**
   * resends verification code to a user
   * @param {string} email email to send verification to
   * @returns {object} verification code object
   */
  static async resendVerification(email) {
    const user = await User.findOne({ email });
    if (!user) {
      customError('cant find your email', 'Not Found', 404);
    }
    return this.sendVerification(user._id, user.email);
  }

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
    // eslint-disable-next-line prefer-const
    const user = (await User.create(data)).toJSON();
    user.access_token = signToken(user._id);
    try {
      await this.sendVerification(user._id, user.email);
    } catch (error) {
      //  If user has already been created, this shouldn't hinder the process
      console.log('email verification code creation error', error);
    }
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

  /**
   * Verifies a user's email
   * @param {object} code param to find code with
   * @return {object} user object
   */
  static async verifyUserEmail(code) {
    const verification = await VerificationCode.findOne({
      code,
      expiresAt: { $gt: new Date() },
      for: 'email',
      isUsed: false
    });
    if (!verification) {
      customError('invalid verification code', 'Bad Request', 400);
    }
    verification.isUsed = true;
    verification.save();
    let user = await User.findById(verification.userId);
    user.emailIsVerified = true;
    user.emailVerifiedAt = new Date();
    user = await user.save();
    return user.toJSON();
  }

  /**
   * Sends a forgot password code
   * @param {string} email email to send code to
   * @returns {boolean} true if successful, throws error if not
   */
  static async forgotPassword(email) {
    const [user, code] = await parallelRequests(
      [() => User.findOne({ email })],
      [strRandom, 30, dupCode, true]
    );
    if (!user) {
      customError('could not find your email', 'Not Found', 404);
    }
    const expiresAt = createExpire(
      parseFloat(process.env.ForgotPasswordCodeExpire || 1) || 1
    );
    await sendMail(
      email,
      'ACAIN Account Password Reset',
      `<div style="text-align: center;"><span style="font-family:verdana,geneva,sans-serif;">
      <p>Hello ${user.name}, </p>
      <p>There was a request to reset your password</p>
      <p>Please click on the button below to get a new password</p>
      <a href='${process.env.ForgotPasswordCallback}?code=${code}'>Reset Password</a>
      <br>
      <p>If you did not make this request, just ignore this mail as nothing has changed.</p>
      <br>
      <br>
      <p>Best Regards, Team</p>
    `
    );
    await VerificationCode.create({
      code,
      for: 'password',
      userId: user._id,
      expiresAt
    });
    return true;
  }

  /**
   * Changes password from forgot password code
   * @param {string} code forgot password code
   * @return {boolean} true if successful, throws error if not
   */
  static async changePasswordFromCode(code, { password, confirmPassword }) {
    const verification = await VerificationCode.findOne({
      code,
      for: 'password',
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });
    if (!verification) {
      customError('invalid verification code', 'Bad Request', 400);
    }
    verification.isUsed = true;
    verification.save();
    if (password !== confirmPassword) {
      customError('passwords do not match', 'Bad Request', 400);
    }
    const user = await User.findById(verification.userId);
    user.password = password;
    await user.save();
    return true;
  }

  /**
   * Middleware that decode user from
   * jwt in authorization and attaches
   * user to the request object or fails.
   * @returns {function} middleware function
   */
  static protectRoute() {
    return async (req, res, next) => {
      try {
        const token = req.headers.authorization;
        if (!token) {
          return Response.authenticationError(
            res,
            'put Bearer token in the authorization header.'
          );
        }
        const data = verifyToken(token);
        const _id = data.payload;
        const user = await User.findById(_id);
        if (!user) {
          return Response.authenticationError(res, 'unauthenticated');
        }
        req.user = user;
        next();
      } catch (error) {
        if (error.name === 'JsonWebTokenError') {
          return Response.authenticationError(res, 'unauthenticated');
        }
        next(error);
      }
    };
  }
}

export default AuthService;
