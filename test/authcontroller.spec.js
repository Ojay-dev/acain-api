import assert from 'assert';
import request from 'supertest';
// import _ from 'lodash';

import app from '../src/app';
import cleanDB from '../src/utils/cleanDB';

describe('singup route', () => {
  beforeEach(async () => {
    await cleanDB();
    return '';
  });

  it('should successfully create a users', (done) => {
    const data = {
      firstname: 'John',
      lastname: 'Dewey',
      state: 'Arghh',
      city: 'townhall',
      email: 'test@user.com',
      emailVerifiedAt: Date,
      password: 'SOM3STORNGP4SSWORD.',
      phone: '+2348123456789',
      address: 'some address',
      membershipType: 'associate_membership',
      profession: {
        isAuthor: true,
        isIllustrator: true
      }
    };
    request(app)
      .post('/api/v1/auth/signup')
      .expect(201)
      .send(data)
      .end((err, res) => {
        if (err) {
          console.log(res.body);
          return done(err);
        }
        const { data: resp } = res.body;
        assert.ok(data.profession.isAuthor === resp.profession.isAuthor);
        assert.ok(
          data.profession.isIllustrator === resp.profession.isIllustrator
        );
        done();
      });
  });
});
