import SubscriberService from '../services/SubscriberService';
import Response from '../utils/response';

/** class that controls subscribers */
class SubscriberController {
  /**
   * gets all subscribers
   * @param {object} req request object
   * @param {object} res resonse object
   * @param {function} next next middleware
   * @returns {Response} HTTP Response
   */
  static async getSubscribers(req, res, next) {
    try {
      const { limit = 15, page = 1 } = req.query;
      const subscribers = await SubscriberService.getAllSubscribers({
        limit,
        page
      });
      return Response.customResponse(res, 200, 'all subscribers', subscribers);
    } catch (error) {
      next(error);
    }
  }

  /**
   * subscribes a single user
   * @param {object} req request object
   * @param {object} res resonse object
   * @param {function} next next middleware
   * @returns {Response} HTTP Response
   */
  static async createSingleSubscriber(req, res, next) {
    try {
      const subscriber = await SubscriberService.createSingleSubscriber(
        req.body.email
      );
      return Response.customResponse(
        res,
        201,
        'subscribed successfully',
        subscriber
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * unsubscribes a single user
   * @param {object} req request object
   * @param {object} res resonse object
   * @param {function} next next middleware
   * @returns {Response} HTTP Response
   */
  static async unsubscribeSingleSubscriber(req, res, next) {
    try {
      await SubscriberService.unsubscribeSingleUser(req.body.email);
      return Response.customResponse(
        res,
        200,
        'unsubscribed successfully',
        null
      );
    } catch (error) {
      next(error);
    }
  }
}

export default SubscriberController;
