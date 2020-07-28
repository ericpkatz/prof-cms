try {
  process.env = {...process.env, ...require('../../../secrets.js')}
}
catch(ex){
  console.log('no secrets file');
}
const { expect } = require('chai');
const app = require('supertest')(require('../../../server/app'));


const jwt = require('jwt-simple');

const smiley = `data:image/jpeg;base64,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`;

const db = require('../../../server/db');
const { Page, Image } = db.models;

describe('Integration: pages', ()=> {
  let users;
  beforeEach(async()=> users = await db.syncAndSeed());
  describe('POST /api/pages', ()=> {
    describe('With image', ()=> {
      it('CAN post', async()=> {
        const token = users['moe@email.com'].generateToken();
        const response = await app.post('/api/pages')
          .set('authorization', token)
          .send({ title: 'foo', content: 'bar', imageData: smiley })
        expect(response.status).to.equal(200);
      });
    });
  });
  describe('PUT /api/pages', ()=> {
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
