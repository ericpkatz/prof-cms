const { expect } = require('chai');
const app = require('supertest')(require('../../../server/app'));
const jwt = require('jwt-simple');

const db = require('../../../server/db');

describe('Routes: pages', ()=> {
  let users;
  beforeEach(async()=> users = await db.syncAndSeed());
  describe('POST /api/pages', ()=> {
    describe('Logged In', ()=> {
      xit('can post', async()=> {
        const response = await app.post('/api/pages')
          .send({ title: 'foo', content: 'bar'})
        expect(response.status).to.equal(200);

      });
    });
    describe('Not Logged In', ()=> {
      xit('can not post', async()=> {
        const response = await app.post('/api/pages')
          .send({ title: 'foo', content: 'bar'})
        expect(response.status).to.equal(401);
      });
    });
  });
});
