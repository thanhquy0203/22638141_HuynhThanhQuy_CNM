const AWS = require("aws-sdk");

AWS.config.update({
  region: "us-west-2",
  accessKeyId: "local",
  secretAccessKey: "local"
});

const dynamoDB = new AWS.DynamoDB.DocumentClient({
  endpoint: "http://dynamodb-local:8000"
});

module.exports = dynamoDB;
