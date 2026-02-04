const ddb = require("../config/dynamodb");
const { PutCommand, ScanCommand, GetCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");

const TABLE = process.env.DDB_PRODUCTS_TABLE;

async function list({ q, categoryId, minPrice, maxPrice, limit = 10, lastKey }) {
  let filter = "#del = :f";
  const names = { "#del": "isDeleted" };
  const values = { ":f": false };

  if (q) {
    filter += " AND contains(#name, :q)";
    names["#name"] = "name";
    values[":q"] = q;
  }
  if (categoryId) {
    filter += " AND #cat = :cat";
    names["#cat"] = "categoryId";
    values[":cat"] = categoryId;
  }
  if (minPrice !== undefined && minPrice !== "") {
    filter += " AND #price >= :minP";
    names["#price"] = "price";
    values[":minP"] = Number(minPrice);
  }
  if (maxPrice !== undefined && maxPrice !== "") {
    filter += " AND #price <= :maxP";
    names["#price"] = "price";
    values[":maxP"] = Number(maxPrice);
  }

  const out = await ddb.send(new ScanCommand({
    TableName: TABLE,
    FilterExpression: filter,
    ExpressionAttributeNames: names,
    ExpressionAttributeValues: values,
    Limit: Number(limit),
    ExclusiveStartKey: lastKey ? JSON.parse(lastKey) : undefined
  }));

  return { items: out.Items || [], nextKey: out.LastEvaluatedKey || null };
}

async function getById(id) {
  const out = await ddb.send(new GetCommand({ TableName: TABLE, Key: { id } }));
  return out.Item || null;
}

async function create(item) {
  await ddb.send(new PutCommand({ TableName: TABLE, Item: item }));
}

async function update(id, data) {
  await ddb.send(new UpdateCommand({
    TableName: TABLE,
    Key: { id },
    UpdateExpression: "SET #n=:n, #p=:p, #q=:q, #c=:c, #img=:img",
    ExpressionAttributeNames: {
      "#n": "name", "#p": "price", "#q": "quantity",
      "#c": "categoryId", "#img": "url_image"
    },
    ExpressionAttributeValues: {
      ":n": data.name,
      ":p": Number(data.price),
      ":q": Number(data.quantity),
      ":c": data.categoryId || null,
      ":img": data.url_image || null
    }
  }));
}

async function softDelete(id) {
  await ddb.send(new UpdateCommand({
    TableName: TABLE,
    Key: { id },
    UpdateExpression: "SET #del=:t",
    ExpressionAttributeNames: { "#del": "isDeleted" },
    ExpressionAttributeValues: { ":t": true }
  }));
}

module.exports = { list, getById, create, update, softDelete };
