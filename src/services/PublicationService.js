/* eslint-disable arrow-body-style */
import _ from 'lodash';

import { customError } from '../errors';
import Publications from '../models/Publications';
import { duplicateCheck, parallelRequests } from '../utils/util';

/** class that handles publications */
class PublicationService {
  /**
   * gets multiple publications
   * @param {object} param criterias for getting pubs
   * @returns {array} array of publication objects
   */
  static async getPublications({ limit, page }, param = {}) {
    const [publications, total] = await parallelRequests(
      [
        () => {
          return Publications.find({ ...param, isDeleted: false })
            .sort([['createdAt', -1]])
            .populate({ path: 'author', select: 'name about' })
            .skip((page - 1) * limit)
            .limit(limit);
        }
      ],
      [() => Publications.countDocuments({ ...param, isDeleted: false })]
    );

    return {
      publications,
      total,
      count: limit,
      page
    };
  }

  /**
   * Creates a single publication
   * @param {object} data pub data
   * @returns {object} created pub object
   */
  static async createSingle(data) {
    if (
      await duplicateCheck(Publications, {
        title: data.title,
        isDeleted: false
      })
    ) {
      customError(
        'there is another publication with this title',
        'Bad Request',
        400
      );
    }
    return Publications.create(data);
  }

  /**
   * Gets a single publication
   * @param {object} param param to search with
   * @returns {object} pub object or throws error not found
   */
  static async getSinglePublication(param) {
    const publication = await Publications.findOne({
      ...param,
      isDeleted: false
    })
      .populate({ path: 'author', select: 'name about' })
      .exec();
    if (!publication) {
      customError('publication not found', 'Not Found', 404);
    }
    return publication;
  }

  /**
   * updates a single publication
   * @param {object} pub search param
   * @param {object} data update data
   * @returns {object} pub object
   */
  static async updateSinglePublication(pub, data) {
    if (data.title) {
      if (
        await duplicateCheck(Publications, {
          title: data.title,
          isDeleted: false
        })
      ) {
        customError(
          'there is another publication with this title',
          'Bad Request',
          400
        );
      }
    }

    _.merge(pub, data);
    pub = await pub.save();
    return pub;
  }

  /**
   * deletes a single publication
   * @param {object} pub search param
   * @returns {null} pub deleted successfully
   */
  static async deleteSinglePublication(pub) {
    pub.isDeleted = true;
    pub = await pub.save();
    return null;
  }
}

export default PublicationService;
