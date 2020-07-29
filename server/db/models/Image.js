const S3 = require('../../S3');
const gm = require('gm');

const db = require('../db')

const Image = db.define('image', {
  id: {
    type: db.Sequelize.UUID,
    defaultValue: db.Sequelize.UUIDV4,
    primaryKey: true
  },
  url: {
    type: db.Sequelize.STRING
  },
  thumbnailURL: {
    type: db.Sequelize.STRING
  },
});

Image.parse = function(data){
  const regex = /data:image\/(\w+);base64,(.*)/;
  const matches = regex.exec(data);
  const extension = matches[1];
  const buffer = Buffer.from(matches[2], 'base64');
  return {
    buffer, extension
  };
}

Image.resize = function(bufferIn, extension, size = 800){
  return new Promise((resolve, reject)=> {
    gm(bufferIn)
      .resize(null, size)
      .toBuffer(extension, (err, bufferOut)=> {
        if(err){
          return reject(err);
        }
        resolve(bufferOut);
      });
  });
}

Image.toAWS = function(buffer, extension, key, bucketName){
    return S3.createBucket({ Bucket: bucketName}).promise()
      .then(()=> {
        return S3.putObject({
          Bucket: bucketName,
          ACL: 'public-read',
          Body: buffer,
          ContentType: `image/${extension}`,
          Key: key
        }).promise();
      })
}

Image.upload = async function(data, bucketName){
    const result = this.parse(data);
    const buffer = result.buffer;
    const extension = result.extension;
    const image = this.build();
    const Key = `${image.id.toString()}.${extension}`;
    const ThumbnailKey = `${image.id.toString()}.thumb.${extension}`;

     await this.resize(buffer, extension).then(buffer=> this.toAWS(buffer, extension, Key, bucketName));
     await this.resize(buffer, extension, 100).then(buffer=> this.toAWS(buffer, extension, ThumbnailKey, bucketName));

    image.url = `https://s3.amazonaws.com/${bucketName}/${Key}`;
    image.thumbnailURL = `https://s3.amazonaws.com/${bucketName}/${ThumbnailKey}`;
    return image.save();
};
module.exports = Image;
