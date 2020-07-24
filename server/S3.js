const AWS = require('aws-sdk');

let { accessKeyId, secretAccessKey } = process.env; 

module.exports = new AWS.S3({
  credentials: {
    accessKeyId,
    secretAccessKey
  }
});
