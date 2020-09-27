import { customError } from '../errors';
/* eslint-disable arrow-body-style */
import Subscribers from '../models/Subscribers';
import { parallelRequests } from '../utils/util';

/** class that handles subscriber service */
class SubscriberService {
  /**
   * gets all email subscribers
   * @param {object} param search param
   * @returns {array} array of subscriber objects
   */
  static async getAllSubscribers({ limit, page }, param = {}) {
    const [subscribers, total] = await parallelRequests(
      [
        () => {
          return Subscribers.find(param)
            .sort([['createdAt', -1]])
            .skip((page - 1) * limit)
            .limit(limit);
        }
      ],
      [() => Subscribers.countDocuments(param)]
    );

    return {
      subscribers,
      total,
      count: limit,
      page
    };
  }

  /**
   * creates a new subscriber
   * @param {string} email email to subscribe user with
   * @returns {object} subscriber object or throws an error
   */
  static async createSingleSubscriber(email) {
    let subscriber = await Subscribers.findOne({ email });
    if (subscriber && subscriber.isSubscribed) {
      customError('email is already subscribed', 'Bad Request', 400);
    }
    if (subscriber) {
      subscriber.isSubscribed = true;
      subscriber = await subscriber.save();
      return subscriber;
    }
    subscriber = await Subscribers.create({ email });
    return subscriber;
  }

  /**
   * unsubscribes a single user
   * @param {string} email user email
   * @returns {null} null if user is found and unsubscribed
   * throws a 404 error otherwise
   */
  static async unsubscribeSingleUser(email) {
    const subscriber = await Subscribers.findOne({ email, isSubscribed: true });
    if (!subscriber) {
      customError('subscriber not found', 'Not Found', 404);
    }
    subscriber.isSubscribed = false;
    await subscriber.save();
    return null;
  }
}

export default SubscriberService;
