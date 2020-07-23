const { expect } = require('chai');
const app = require('supertest')(require('../../../server/app'));
const jwt = require('jwt-simple');

const db = require('../../../server/db');

describe('Routes: auth', ()=> {
  let users;
  beforeEach(async()=> users = await db.syncAndSeed());
  describe('POST /api/auth', ()=> {
    describe('With correct email and password', ()=> {
      it('returns token', async()=> {
        const response = await app.post('/api/auth')
          .send({ email: 'moe@email.com', password: 'MOE'})
        expect(response.status).to.equal(200);

      });
    });
    describe('With incorrect email and password', ()=> {
      it('returns 401', async()=> {
        const response = await app.post('/api/auth')
          .send({ email: 'moe@email.com', password: 'MO'})
        expect(response.status).to.equal(401);

      });
    });
  });
  describe('GET /api/auth', ()=> {
    describe('With a valid token', ()=> {
      it('returns user', async()=> {
        const token = jwt.encode({ id: users['moe@email.com'].id}, process.env.JWT_SECRET);
        const response = await app.get('/api/auth')
          .set('authorization', token)
        expect(response.status).to.equal(200);

      });
    });
    xdescribe('With incorrect email and password', ()=> {
      it('returns 401', async()=> {
        const response = await app.post('/api/auth')
          .send({ email: 'moe@email.com', password: 'MO'})
        expect(response.status).to.equal(401);

      });
    });
  });
});
