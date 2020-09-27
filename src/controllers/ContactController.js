import ContactService from '../services/ContactService';
import Response from '../utils/response';

/** class that controls contacts */
class ContactController {
  /**
   * create single contact message
   * @param {object} req request object
   * @param {object} res resonse object
   * @param {function} next next middleware
   * @returns {Response} HTTP Response
   */
  static async createContact(req, res, next) {
    try {
      const data = await ContactService.createSingleContact(req.body);
      return Response.customResponse(
        res,
        201,
        'contact message recieved',
        data
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * decodes id param from route
   * @param {object} req request object
   * @param {object} res resonse object
   * @param {function} next next middleware
   * @param {string} id id passed on route
   * @returns {Response} HTTP Response
   */
  static async contactIdParam(req, res, next, id) {
    try {
      req.contact = await ContactService.getSingleContact({ _id: id });
      next();
    } catch (error) {
      if (error.name === 'CastError') {
        return Response.notFoundError(res, 'contact not found');
      }
      next(error);
    }
  }

  /**
   * gets single contact message
   * @param {object} req request object
   * @param {object} res resonse object
   * @returns {Response} HTTP Response
   */
  static async getSingleContact(req, res) {
    return Response.customResponse(res, 200, 'contact message', req.contact);
  }

  /**
   * gets all contact messages
   * @param {object} req request object
   * @param {object} res resonse object
   * @param {function} next next middleware
   * @returns {Response} HTTP Response
   */
  static async getAllContact(req, res, next) {
    try {
      const { limit = 15, page = 1 } = req.query;
      const contacts = await ContactService.getAllContacts({ limit, page });
      return Response.customResponse(res, 200, 'contact messages', contacts);
    } catch (error) {
      next(error);
    }
  }

  /**
   * deletes single contact message
   * @param {object} req request object
   * @param {object} res resonse object
   * @param {function} next next middleware
   * @returns {Response} HTTP Response
   */
  static async deleteSingleContact(req, res, next) {
    try {
      await ContactService.deleteSingleContact(req.contact);
      return Response.customResponse(res, 200, 'contact message deleted', null);
    } catch (error) {
      next(error);
    }
  }
}

export default ContactController;
