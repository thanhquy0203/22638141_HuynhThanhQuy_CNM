const ddb = require("../config/dynamodb");
const { PutCommand, ScanCommand, GetCommand, UpdateCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");

const TABLE = process.env.DDB_CATEGORIES_TABLE;

async function listAll() {
  const out = await ddb.send(new ScanCommand({ TableName: TABLE }));
  return out.Items || [];
}

async function getById(categoryId) {
  const out = await ddb.send(new GetCommand({ TableName: TABLE, Key: { categoryId } }));
  return out.Item || null;
}

async function create(item) {
  await ddb.send(new PutCommand({ TableName: TABLE, Item: item }));
}

async function update(categoryId, data) {
  await ddb.send(new UpdateCommand({
    TableName: TABLE,
    Key: { categoryId },
    UpdateExpression: "SET #n=:n, #d=:d",
    ExpressionAttributeNames: { "#n": "name", "#d": "description" },
    ExpressionAttributeValues: { ":n": data.name, ":d": data.description || "" }
  }));
}

async function remove(categoryId) {
  await ddb.send(new DeleteCommand({ TableName: TABLE, Key: { categoryId } }));
}

module.exports = { listAll, getById, create, update, remove };
