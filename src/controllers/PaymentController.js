/* eslint-disable no-underscore-dangle */

import PaymentService from '../services/PaymentService';
import Response from '../utils/response';

/** class that controls payments */
class PaymentController {
  /**
   * Creates a new payment entry
   * @param {object} req request object
   * @param {object} res resonse object
   * @param {function} next next middleware
   * @returns {Response} HTTP Response
   */
  static async startPaymentProcess(req, res, next) {
    try {
      const { membershipType } = req.body;
      const paymentData = {
        phoneNumber: req.user.phone,
        name: req.user.name,
        id: req.user._id,
        email: req.user.email,
        membershipType
      };

      const payment = await PaymentService.createNewPayment(paymentData);
      return Response.customResponse(res, 201, 'payment initialized', payment);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Verifies a payment
   * @param {object} req request object
   * @param {object} res resonse object
   * @param {function} next next middleware
   * @returns {Response} HTTP Response
   */
  static async verifyPayment(req, res, next) {
    try {
      const verify = await PaymentService.verifyPayment(req.body);
      return Response.customResponse(res, 200, 'payment verified', verify);
    } catch (error) {
      next(error);
    }
  }
}

export default PaymentController;
