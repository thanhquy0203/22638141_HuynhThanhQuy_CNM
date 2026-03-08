const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
  UpdateCommand,
  GetCommand
} = require("@aws-sdk/lib-dynamodb");

const { v4: uuidv4 } = require("uuid");

const REGION = process.env.AWS_REGION || "ap-southeast-1";
const TABLE_NAME = process.env.TODO_TABLE || "TodoTable";

const client = new DynamoDBClient({
  region: REGION
});

const ddb = DynamoDBDocumentClient.from(client);


// LIST TODOS
exports.listTodos = async () => {
  try {
    const result = await ddb.send(
      new ScanCommand({
        TableName: TABLE_NAME
      })
    );

    return result.Items || [];

  } catch (err) {
    console.error("DynamoDB list error:", err);
    return [];
  }
};


// ADD TODO
exports.addTodo = async (title) => {

  const item = {
    todoId: uuidv4(),
    title,
    done: false,
    createdAt: new Date().toISOString()
  };

  try {
    await ddb.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: item
      })
    );
  } catch (err) {
    console.error("DynamoDB add error:", err);
  }

};


// TOGGLE TODO
exports.toggleTodo = async (todoId) => {

  try {

    // Lấy item hiện tại
    const current = await ddb.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { todoId }
      })
    );

    if (!current.Item) return;

    const newStatus = !current.Item.done;

    await ddb.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { todoId },
        UpdateExpression: "SET done = :d",
        ExpressionAttributeValues: {
          ":d": newStatus
        }
      })
    );

  } catch (err) {
    console.error("DynamoDB toggle error:", err);
  }

};