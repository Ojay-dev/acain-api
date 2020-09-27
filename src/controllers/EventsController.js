/* eslint-disable no-underscore-dangle */
import EventsService from '../services/EventsService';
import Response from '../utils/response';
import { uploadFile } from '../utils/util';

/** class that controls events */
class EventsController {
  /**
   * creates a single event
   * @param {object} req request object
   * @param {object} res resonse object
   * @param {function} next next middleware
   * @returns {Response} HTTP Response
   */
  static async createEvent(req, res, next) {
    try {
      const data = await EventsService.createSingleEvent(req.body);
      return Response.customResponse(res, 201, 'event created', data);
    } catch (error) {
      next(error);
    }
  }

  /**
   * gets all events event
   * @param {object} req request object
   * @param {object} res resonse object
   * @param {function} next next middleware
   * @returns {Response} HTTP Response
   */
  static async getAllEvents(req, res, next) {
    try {
      const { limit = 15, page = 1 } = req.query;
      const data = await EventsService.getAllEvents({ limit, page });
      return Response.customResponse(res, 200, 'events', data);
    } catch (error) {
      next(error);
    }
  }

  /**
   * decodes id from route
   * @param {object} req request object
   * @param {object} res resonse object
   * @param {function} next next middleware
   * @param {string} id decoded id
   * @returns {Response} HTTP Response
   */
  static async eventIdParam(req, res, next, id) {
    try {
      req.event = await EventsService.getSingleEvent({ _id: id });
      next();
    } catch (error) {
      if (error.name === 'CastError') {
        return Response.notFoundError(res, 'event not found');
      }
      next(error);
    }
  }

  /**
   * updates a single event
   * @param {object} req request object
   * @param {object} res resonse object
   * @param {function} next next middleware
   * @returns {Response} HTTP Response
   */
  static async updateSingleEvent(req, res, next) {
    try {
      const data = await EventsService.updateSingleEvent(req.event, req.body);
      return Response.customResponse(res, 200, 'event updated', data);
    } catch (error) {
      next(error);
    }
  }

  /**
   * gets a single event
   * @param {object} req request object
   * @param {object} res resonse object
   * @param {function} next next middleware
   * @returns {Response} HTTP Response
   */
  static getSingleEvent(req, res) {
    return Response.customResponse(res, 200, 'event', req.event);
  }

  /**
   * deletes a single event
   * @param {object} req request object
   * @param {object} res resonse object
   * @param {function} next next middleware
   * @returns {Response} HTTP Response
   */
  static async deleteSingleEvent(req, res, next) {
    try {
      await EventsService.deleteSingleEvent(req.event);
      return Response.customResponse(res, 200, 'event deleted', null);
    } catch (error) {
      next(error);
    }
  }

  /**
   * updates a single event's image
   * @param {object} req request object
   * @param {object} res resonse object
   * @param {function} next next middleware
   * @returns {Response} HTTP Response
   */
  static async updateEventImage(req, res, next) {
    try {
      const result = await uploadFile(req, 'image', {
        public_id: `events/${req.event._id}`,
        format: 'png'
      });
      const event = await EventsService.updateSingleEvent(req.event, {
        image: result.url
      });
      return Response.customResponse(res, 200, 'event image updated', event);
    } catch (error) {
      next(error);
    }
  }
}

export default EventsController;
