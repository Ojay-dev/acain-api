import BoardMemberService from '../services/BoardMemberService';
import Response from '../utils/response';

/** class that handles board member controllers */
class BoardMemberController {
  /**
   * Gets all board members
   * @param {object} req request object
   * @param {object} res resonse object
   * @param {function} next next middleware
   * @returns {Response} HTTP Response
   */
  static async getAllBoardMembers(req, res, next) {
    try {
      const { limit = 15, page = 1 } = req.query;
      const data = await BoardMemberService.getBoardMembers({ limit, page });
      return Response.customResponse(res, 200, 'board members', data);
    } catch (error) {
      next(error);
    }
  }

  /**
   * gets a single publication by id
   * @param {object} req request object
   * @param {object} res resonse object
   * @param {function} next next middleware
   * @returns {Response} HTTP Response
   */
  static async getSingleBoardMember(req, res, next) {
    try {
      const data = await BoardMemberService.getSingleBoardMember({
        _id: req.params.id
      });
      return Response.customResponse(res, 200, 'board member', data);
    } catch (error) {
      if (error.name === 'CastError') {
        return Response.notFoundError(res, 'board member not found');
      }
      next(error);
    }
  }

  /**
   * creates single board member
   * @param {object} req request object
   * @param {object} res resonse object
   * @param {function} next next middleware
   * @returns {Response} HTTP Response
   */
  static async createSingleBoardMember(req, res, next) {
    try {
      const user = await BoardMemberService.createSingleBoardMember(req.body);
      return Response.customResponse(
        res,
        201,
        'board member created successfully',
        user
      );
    } catch (error) {
      next(error);
    }
  }
}

export default BoardMemberController;
