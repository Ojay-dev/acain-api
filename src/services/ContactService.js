/* eslint-disable arrow-body-style */
import Contacts from '../models/Contacts';
import { customError } from '../errors';
import { parallelRequests } from '../utils/util';

/** class that handles the contact service */
class ContactService {
  /**
   * creates a single contact message
   * @param {object} data creation data
   * @returns {object} contact object
   */
  static async createSingleContact(data) {
    return Contacts.create(data);
  }

  /**
   * gets a single contact message
   * @param {object} param search param
   * @returns {object} contact object or throw error
   */
  static async getSingleContact(param) {
    const contact = await Contacts.findOne(param);
    if (!contact) {
      customError('contact not found', 'Not Found', 404);
    }
    return contact;
  }

  /**
   * gets all contact messages
   * @param {object} param search param
   * @returns {object} paginated contact objects
   */
  static async getAllContacts({ limit, page }, param = {}) {
    const [contacts, total] = await parallelRequests(
      [
        () => {
          return Contacts.find(param)
            .sort([['createdAt', -1]])
            .skip((page - 1) * limit)
            .limit(limit);
        }
      ],
      [() => Contacts.countDocuments(param)]
    );

    return {
      contacts,
      total,
      count: limit,
      page
    };
  }

  /**
   * deletes a single contact message
   * @param {object} contact contact message to delete
   * @returns {null} object deleted and null returned
   */
  static async deleteSingleContact(contact) {
    await contact.remove();
    return null;
  }
}

export default ContactService;
