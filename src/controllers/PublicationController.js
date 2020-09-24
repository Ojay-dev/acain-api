/* eslint-disable no-underscore-dangle */
import PublicationService from '../services/PublicationService';
import Response from '../utils/response';
import { uploadFile } from '../utils/util';

/** class that controls publications */
class PublicationController {
  /**
   * gets all publications
   * @param {object} req request object
   * @param {object} res resonse object
   * @param {function} next next middleware
   * @returns {Response} HTTP Response
   */
  static async getAllPublications(req, res, next) {
    try {
      const { limit = 15, page = 1 } = req.query;
      const data = await PublicationService.getPublications({ limit, page });
      return Response.customResponse(res, 200, 'all publications', data);
    } catch (error) {
      next(error);
    }
  }

  /**
   * gets all publications for authenticated user
   * @param {object} req request object
   * @param {object} res resonse object
   * @param {function} next next middleware
   * @returns {Response} HTTP Response
   */
  static async getAllPublicationsAuth(req, res, next) {
    try {
      const { limit = 15, page = 1 } = req.query;
      const data = await PublicationService.getPublications(
        { limit, page },
        { author: req.user._id }
      );
      return Response.customResponse(res, 200, 'all publications', data);
    } catch (error) {
      next(error);
    }
  }

  /**
   * creates a single publication
   * @param {object} req request object
   * @param {object} res resonse object
   * @param {function} next next middleware
   * @returns {Response} HTTP Response
   */
  static async createSinglePublication(req, res, next) {
    try {
      const data = { ...req.body, author: req.user._id };
      const pub = await PublicationService.createSingle(data);
      return Response.customResponse(res, 201, 'your publication', pub);
    } catch (error) {
      next(error);
    }
  }

  /**
   * id param route
   * @param {object} req request object
   * @param {object} res resonse object
   * @param {function} next next middleware
   * @param {string} _id id passed on route
   * @returns {Response} HTTP Response
   */
  static async pubIdParamRoute(req, res, next, _id) {
    try {
      req.pub = await PublicationService.getSinglePublication({ _id });
      next();
    } catch (error) {
      if (error.name === 'CastError') {
        return Response.notFoundError(res, 'publication not found');
      }
      next(error);
    }
  }

  /**
   * gets a single publication by id
   * @param {object} req request object
   * @param {object} res resonse object
   * @returns {Response} HTTP Response
   */
  static getSinglePublication(req, res) {
    return Response.customResponse(res, 200, 'publication', req.pub);
  }

  /**
   * updates a single publication
   * @param {object} req request object
   * @param {object} res resonse object
   * @param {function} next next middleware
   * @returns {Response} HTTP Response
   */
  static async updateSinglePublication(req, res, next) {
    try {
      if (req.pub.author._id.toString() !== req.user._id.toString()) {
        return Response.authorizationError(res, 'unauthorized');
      }
      const update = await PublicationService.updateSinglePublication(
        req.pub,
        req.body
      );
      return Response.customResponse(res, 200, 'publication updated', update);
    } catch (error) {
      next(error);
    }
  }

  /**
   * deletes a single publication
   * @param {object} req request object
   * @param {object} res resonse object
   * @param {function} next next middleware
   * @returns {Response} HTTP Response
   */
  static async deleteSinglePublication(req, res, next) {
    try {
      if (req.pub.author._id.toString() !== req.user._id.toString()) {
        return Response.authorizationError(res, 'unauthorized');
      }
      await PublicationService.deleteSinglePublication(req.pub);
      return Response.customResponse(res, 200, 'publication deleted', null);
    } catch (error) {
      next(error);
    }
  }

  /**
   * updates a single publication's image
   * @param {object} req request object
   * @param {object} res resonse object
   * @param {function} next next middleware
   * @returns {Response} HTTP Response
   */
  static async updateSinglePublicationImage(req, res, next) {
    try {
      if (req.pub.author._id.toString() !== req.user._id.toString()) {
        return Response.authorizationError(res, 'unauthorized');
      }
      const result = await uploadFile(req, 'image', {
        transformation: [{ width: 200, height: 200 }],
        public_id: `publications/${req.user._id}`,
        format: 'png'
      });
      const pub = await PublicationService.updateSinglePublication(req.pub, {
        image: result.url
      });
      return Response.customResponse(
        res,
        200,
        'publication image updated',
        pub
      );
    } catch (error) {
      next(error);
    }
  }
}

export default PublicationController;
