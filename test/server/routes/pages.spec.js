const { expect } = require('chai');
const app = require('supertest')(require('../../../server/app'));
const jwt = require('jwt-simple');

const db = require('../../../server/db');
const { Page, Image } = db.models;

describe('Routes: pages', ()=> {
  let users;
  beforeEach(async()=> users = await db.syncAndSeed());
  describe('GET /api/pages', ()=> {
    it('returns pages', async()=> {
      const response = await app.get('/api/pages')
      expect(response.status).to.equal(200);
    });
    it('creates a page if one does not exist', async()=> {
      const response = await app.get('/api/pages');
      expect(response.status).to.equal(200);
      expect(response.body.title).to.equal('Home');
    });
  });
  describe('POST /api/pages', ()=> {
    describe('Not Logged In', ()=> {
      it('can NOT post', async()=> {
        const response = await app.post('/api/pages')
          .send({ title: 'foo', content: 'bar'})
        expect(response.status).to.equal(401);

      });
    });
    describe('Logged In', ()=> {
      it('CAN post', async()=> {
        const token = users['moe@email.com'].generateToken();
        const response = await app.post('/api/pages')
          .set('authorization', token)
          .send({ title: 'foo', content: 'bar'})
        expect(response.status).to.equal(200);
      });
    });
  });
  describe('PUT /api/pages', ()=> {
    describe('Not Logged In', ()=> {
      it('can NOT put', async()=> {
        const page = await Page.getHomePage(); 
        const response = await app.put(`/api/pages/${page.id}`)
          .send({ title: `${page.title}!!!`})

        expect(response.status).to.equal(401);

      });
    });
    describe('Logged In', ()=> {
      it('CAN put', async()=> {
        const token = users['moe@email.com'].generateToken();
        const page = await Page.getHomePage(); 
        const response = await app.put(`/api/pages/${page.id}`)
          .set({ authorization: token })
          .send({ title: `${page.title}!!!`})

        expect(response.status).to.equal(200);
      });
    });
  });
  describe('DELETE /api/pages', ()=> {
    describe('Not Logged In', ()=> {
      it('can NOT delete', async()=> {
        const homePage = await Page.getHomePage(); 

        const page = await Page.create({ 
          title: 'foo',
          content: 'bar',
          parentId: homePage.id
        })
        const response = await app.delete(`/api/pages/${page.id}`)

        expect(response.status).to.equal(401);
      });
    });
    describe('Logged In', ()=> {
      it('CAN delete', async()=> {
        const token = users['moe@email.com'].generateToken();
        const homePage = await Page.getHomePage(); 

        const page = await Page.create({ 
          title: 'foo',
          content: 'bar',
          parentId: homePage.id
        })
        const response = await app.delete(`/api/pages/${page.id}`)
        .send('authorization', token);

        expect(response.status).to.equal(401);
      });
    });
  });
});
