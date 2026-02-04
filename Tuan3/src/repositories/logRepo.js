const ddb = require("../config/dynamodb");
const { PutCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");

const TABLE = process.env.DDB_LOGS_TABLE;

async function writeLog(item) {
  await ddb.send(new PutCommand({ TableName: TABLE, Item: item }));
}

async function listAll() {
  const out = await ddb.send(new ScanCommand({ TableName: TABLE }));
  // sort time desc (demo)
  return (out.Items || []).sort((a,b) => (b.time || "").localeCompare(a.time || ""));
}

module.exports = { writeLog, listAll };
