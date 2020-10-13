/* eslint-disable operator-linebreak */
/* eslint-disable implicit-arrow-linebreak */
import axios from 'axios';
import { customError } from '../errors';

import Payment from '../models/Payment';
import { duplicateCheck, parallelRequests, strRandom } from '../utils/util';
import AuthService from './AuthService';

/** class that delivers the payment service */
class PaymentService {
  /**
   * starts a new payment process
   * @param {object} data
   * @returns {object} payment object
   */
  static async createNewPayment(data) {
    // eslint-disable-next-line object-curly-newline
    const { name, id, phoneNumber, email, membershipType } = data;
    const memberships = {
      associate_membership: process.env.ASSOCIATE_MEMBERSHIP,
      full_membership: process.env.FULL_MEMBERSHIP
    };
    if (!membershipType || !(membershipType.toLowerCase() in memberships)) {
      customError(
        'please pick a valid membership type. associate_membership or full_membership',
        'Bad Request',
        400
      );
    }
    const amount = process.env[membershipType.toUpperCase()];
    const transRef = await strRandom(
      10,
      (str) => duplicateCheck(Payment, { transRef: str }),
      true
    );
    const paymentPayload = {
      tx_ref: transRef,
      amount,
      currency: 'NGN',
      redirect_url: process.env.PAYMENT_CALLBACK,
      payment_options: 'card',
      customer: {
        email,
        id,
        name,
        phoneNumber
      },
      customizations: {
        title: 'Acain',
        description: 'Some description',
        logo: ''
      }
    };
    const req = await axios.post(
      process.env.FLUTTERWAVE_PAYMENTAPI,
      paymentPayload,
      {
        headers: {
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRETKEY}`
        }
      }
    );
    const res = req.data;

    return Payment.create({
      transRef,
      amount,
      membershipType,
      user: id,
      link: res.data.link
    });
  }

  /**
   * verifies payment
   * @param {object} param
   * @returns {object} payment object
   */
  static async verifyPayment(param) {
    const { transRef = '', transID = '' } = param;
    const [payment, verify] = await parallelRequests(
      [() => Payment.findOne({ transRef })],
      [
        () =>
          axios.get(
            `https://api.flutterwave.com/v3/transactions/${transID}/verify`,
            {
              headers: {
                Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRETKEY}`
              }
            }
          )
      ]
    );
    if (!payment) {
      customError('Payment with transRef not found', 'Not Found', 404);
    }
    const { data } = verify;
    if (
      data.status !== 'success' ||
      data.data.currency !== 'NGN' ||
      data.data.amount < payment.amount
    ) {
      customError('Please complete payment', 'Bad Request', 400);
    }
    await AuthService.updatePayment({
      _id: payment.user,
      membershipType: payment.membershipType
    });
    payment.flutterwaveID = data.data.id;
    payment.isConfirmed = true;

    return payment.save();
  }
}

export default PaymentService;
