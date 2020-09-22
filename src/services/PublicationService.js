/* eslint-disable arrow-body-style */
import Publications from '../models/Publications';
import { parallelRequests } from '../utils/util';

/** class that handles publications */
class PublicationService {
  /**
   * gets multiple publications
   * @param {object} param criterias for getting pubs
   * @returns {array} array of publication objects
   */
  static async getPublications(param = {}, { limit = 100, page = 1 }) {
    const [publications, total] = await parallelRequests(
      [
        () => {
          return Publications.find(param)
            .sort([['createdAt', -1]])
            .skip((page - 1) * limit)
            .limit(limit);
        }
      ],
      [() => Publications.countDocuments(param)]
    );

    return {
      publications,
      total,
      count: limit,
      page
    };
  }
}

export default PublicationService;
