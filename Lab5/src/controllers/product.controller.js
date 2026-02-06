const dynamoDB = require("../config/dynamodb");
const { v4: uuidv4 } = require("uuid");

const TABLE_NAME = "Products";

// READ
exports.getAll = async (req, res) => {
  const data = await dynamoDB.scan({
    TableName: TABLE_NAME
  }).promise();

  res.render("index", { products: data.Items });
};

// CREATE FORM
exports.createForm = (req, res) => {
  res.render("create");
};

// CREATE
exports.create = async (req, res) => {
  const { name, price, url_image } = req.body;

  await dynamoDB.put({
    TableName: TABLE_NAME,
    Item: {
      id: uuidv4(),
      name,
      price,
      url_image
    }
  }).promise();

  res.redirect("/");
};

// EDIT FORM
exports.editForm = async (req, res) => {
  const { id } = req.params;

  const data = await dynamoDB.get({
    TableName: TABLE_NAME,
    Key: { id }
  }).promise();

  res.render("edit", { product: data.Item });
};

// UPDATE
exports.update = async (req, res) => {
  const { id } = req.params;
  const { name, price, url_image } = req.body;

  await dynamoDB.update({
    TableName: TABLE_NAME,
    Key: { id },
    UpdateExpression: "set #n = :n, price = :p, url_image = :u",
    ExpressionAttributeNames: {
      "#n": "name"
    },
    ExpressionAttributeValues: {
      ":n": name,
      ":p": price,
      ":u": url_image
    }
  }).promise();

  res.redirect("/");
};

// DELETE
exports.delete = async (req, res) => {
  const { id } = req.params;

  await dynamoDB.delete({
    TableName: TABLE_NAME,
    Key: { id }
  }).promise();

  res.redirect("/");
};
