/* eslint-disable no-underscore-dangle */
require('@babel/polyfill');
const assert = require('assert');
const _ = require('lodash');
const { default: Payment } = require('../src/models/Payment');

const { default: User } = require('../src/models/User');
const { default: PaymentService } = require('../src/services/PaymentService');
const { default: cleanDB } = require('../src/utils/cleanDB');

describe('payment service', () => {
  let user;
  beforeEach(async () => {
    await cleanDB();
    user = await User.create({
      name: 'John Dewey',
      username: 'j_dewey',
      email: 'j@d.wey',
      password: 'chameleon',
      phone: '+2438162452124',
      address: 'somewhere on earth'
    });
    return '';
  });

  it('should start new payment transaction', async () => {
    const data = {
      name: user.name,
      id: user._id,
      phoneNumber: user.phone,
      email: user.email,
      membershipType: 'full_membership'
    };
    const payment = await PaymentService.createNewPayment(data);
    assert.deepStrictEqual(
      _.pick(payment, ['user', 'isConfirmed', 'membershipType']),
      {
        user: user._id,
        isConfirmed: false,
        membershipType: 'full_membership'
      }
    );
    return '';
  });

  //  JqGZnQuAnT - 1593656
  it('should confirm a new payment provided the tx_ref and tx_id', async () => {
    const transRef = 'JqGZnQuAnT';
    const transID = '1593656';
    await Payment.create({
      transRef,
      amount: 1,
      membershipType: 'full_membership',
      user: user._id,
      link: 'https://checkout-testing.herokuapp.com/v3/hosted/pay/479cd72c571ab561f66e'
    });
    const verify = await PaymentService.verifyPayment({ transRef, transID });
    const payedUser = await User.findById(user._id);
    assert.ok(payedUser.lastPayment.getFullYear() === (new Date()).getFullYear());
    assert.ok(verify.isConfirmed);
  });
});
