const expect = require('chai').expect;
const db = require('../../../server/db');
const { User, Image } = db.models; 
const sinon = require('sinon');
const fs = require('fs');
const path = require('path');
const gm = require('gm');

describe('Models', ()=> {
  let users;
  beforeEach(async()=> users = await db.syncAndSeed());
  describe('Image', ()=> {
    describe('#resize', ()=> {
      it('resizes an image', (done)=> {
        const source = path.join(__dirname, './olive_fit.jpg'); 
        const target = path.join(__dirname, './olive_fit.thumb.jpg'); 
        gm(source)
          .resize(100, 100)
          .write(target, (err, result)=> {
            done(err);
          });

      });
    });
    describe('with an invalid image', ()=> {
      it('fails', ()=> {
        return Image.upload('FOO')
          .then(()=> { throw 'nooo'; })
          .catch( ex => expect(ex.message).to.equal('BASE64 ERROR'));
      });
    });

    describe('with valid image', ()=> {
      let parse, toAWS, resize;
      beforeEach(()=> {
        parse = sinon.stub(Image, 'parse');
        parse.withArgs('ABC').returns({ buffer: 'DEF', extension: 'png'});

        resize = sinon.stub(Image, 'resize');
        resize.withArgs('DEF', 'png').returns(Promise.resolve('RESIZED'));

        toAWS = sinon.stub(Image, 'toAWS');
        toAWS.withArgs('RESIZED', 'png').returns(Promise.resolve());
      });
      afterEach(()=> {
        parse.restore();
        resize.restore();
        toAWS.restore();
      });
      it('can be uploaded', ()=> {
        return Image.upload('ABC', 'bucket')
          .then( image => expect(image.url).to.equal(`https://s3.amazonaws.com/bucket/${image.id}.png`));
      });
    });
  });
});
