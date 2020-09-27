/* eslint-disable arrow-body-style */
import _ from 'lodash';

import Events from '../models/Events';
import { customError } from '../errors';
import { parallelRequests } from '../utils/util';

/** class that services events */
class EventsService {
  /**
   * creates a single event
   * @param {object} data data to create event from
   * @returns {object} event object
   */
  static createSingleEvent(data) {
    return Events.create(data);
  }

  /**
   * gets a single event
   * @param {object} param search param
   * @returns {object} event object
   */
  static async getSingleEvent(param) {
    const event = await Events.findOne(param);
    if (!event) {
      customError('event not found', 'Not Found', 404);
    }
    return event;
  }

  /**
   * gets all events
   * @param {object} param search param
   * @returns {object} object with events(array) and pagination data
   */
  static async getAllEvents({ limit, page }, param = {}) {
    const [events, total] = await parallelRequests(
      [
        () => {
          return Events.find(param)
            .sort([['eventDate', -1]])
            .skip((page - 1) * limit)
            .limit(limit);
        }
      ],
      [() => Events.countDocuments(param)]
    );

    return {
      events,
      total,
      count: limit,
      page
    };
  }

  /**
   * updates a single event
   * @param {object} event event object
   * @param {object} data update data
   * @returns {object} updated event object
   */
  static async updateSingleEvent(event, data) {
    _.merge(event, data);
    event = await event.save();
    return event;
  }

  /**
   * deletes a single event
   * @param {object} event event object
   * @returns {null} event removed successfully
   */
  static async deleteSingleEvent(event) {
    await event.remove();
    return null;
  }
}

export default EventsService;
