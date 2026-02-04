const ddb = require("../config/dynamodb");
const { PutCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");

const TABLE = process.env.DDB_USERS_TABLE;

async function findByUsername(username) {
  // Demo dùng Scan. Nâng cao: tạo GSI username-index để Query.
  const out = await ddb.send(new ScanCommand({
    TableName: TABLE,
    FilterExpression: "#u = :u",
    ExpressionAttributeNames: { "#u": "username" },
    ExpressionAttributeValues: { ":u": username }
  }));
  return out.Items?.[0] || null;
}

async function createUser(user) {
  await ddb.send(new PutCommand({ TableName: TABLE, Item: user }));
}

module.exports = { findByUsername, createUser };
