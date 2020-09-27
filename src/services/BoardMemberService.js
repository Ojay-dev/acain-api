/* eslint-disable arrow-body-style */
import { parallelRequests, strRandom } from '../utils/util';
import User from '../models/User';
import AuthService from './AuthService';
import { customError } from '../errors';

/** class that handles board member services */
class BoardMemberService {
  /**
   * Gets all board members
   * @param {object} param search param
   * @returns {array} array of board member objects
   */
  static async getBoardMembers({ limit, page }, param = {}) {
    const [boardMembers, total] = await parallelRequests(
      [
        () => {
          return User.find({ ...param, app_role: 'board_member' })
            .sort([['createdAt', -1]])
            .select(
              '-password -emailIsVerified -phoneIsVerified -app_role -emailVerifiedAt -phoneVerifiedAt'
            )
            .skip((page - 1) * limit)
            .limit(limit);
        }
      ],
      [() => User.countDocuments({ ...param, app_role: 'board_member' })]
    );

    return {
      boardMembers,
      total,
      count: limit,
      page
    };
  }

  /**
   * Gets single board member
   * @param {object} param param to find with
   * @return {object} board member object or throw
   * 404 error
   */
  static async getSingleBoardMember(param) {
    const boardMember = await User.findOne({
      ...param,
      app_role: 'board_member'
    })
      .select(
        '-password -emailIsVerified -phoneIsVerified -app_role -emailVerifiedAt -phoneVerifiedAt'
      )
      .exec();
    if (!boardMember) {
      customError('board member not found', 'Not Found', 404);
    }
    return boardMember;
  }

  /**
   * creates a single board member
   * @param {object} data create data
   * @returns {object} board member object
   */
  static async createSingleBoardMember(data) {
    data.app_role = 'board_member';
    data.password = data.password || (await strRandom(32));
    return AuthService.createSingleUser(data);
  }
}

export default BoardMemberService;
