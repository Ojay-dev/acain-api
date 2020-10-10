/* eslint-disable no-underscore-dangle */
import '@babel/polyfill';
import request from 'supertest';
import assert from 'assert';
import _ from 'lodash';

import app from '../src/app';
import User from '../src/models/User';
import cleanDB from '../src/utils/cleanDB';
import { signToken } from '../src/utils/jwtservice';
import Payment from '../src/models/Payment';

describe('payment functionality', () => {
  let user;
  beforeEach(async () => {
    await cleanDB();
    user = await User.create({
      firstname: 'John',
      lastname: 'Dewey',
      state: 'Arghh',
      city: 'town hall',
      username: 'j_dewey',
      email: 'j@d.wey',
      password: 'chameleon',
      phone: '+2438162452124',
      address: 'somewhere on earth'
    });
    return '';
  });

  it('should be able to start payments', (done) => {
    request(app)
      .post('/api/v1/pay')
      .expect(201)
      .send({
        membershipType: 'full_membership'
      })
      .set({
        Authorization: `Bearer ${signToken(user._id)}`
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        const payment = res.body.data;
        assert.deepStrictEqual(
          _.pick(payment, ['isConfirmed', 'membershipType']),
          {
            isConfirmed: false,
            membershipType: 'full_membership'
          }
        );
        assert.ok(
          payment.link && typeof payment.link === 'string'
          && payment.transRef && typeof payment.transRef === 'string'
        );
        done();
      });
  });

  it('should be able to verify payments', (done) => {
    const transRef = 'JqGZnQuAnT';
    const transID = '1593656';
    Payment.create({
      transRef,
      amount: 1,
      membershipType: 'full_membership',
      user: user._id,
      link: 'https://checkout-testing.herokuapp.com/v3/hosted/pay/479cd72c571ab561f66e'
    })
    .then(() => {
      request(app)
      .put('/api/v1/pay')
      .expect(200)
      .send({
        transRef,
        transID
      })
      .set({
        Authorization: `Bearer ${signToken(user._id)}`
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        const verify = res.body.data;
        User.findById(user._id, (error, payedUser) => {
          if (error) {
            done(error);
          }
          assert.ok(payedUser.lastPayment.getFullYear() === (new Date()).getFullYear());
          assert.ok(verify.isConfirmed);
          done();
        });
      });
    }).catch(done);
  });
});
