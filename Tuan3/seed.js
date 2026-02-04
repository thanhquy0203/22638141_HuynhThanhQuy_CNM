require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const ddb = require("./src/config/dynamodb");
const { PutCommand } = require("@aws-sdk/lib-dynamodb");

const TABLE = process.env.DDB_PRODUCTS_TABLE;

const products = [
  {
    name: "iPhone 14",
    price: 1200,
    quantity: 10,
    categoryId: "Electronics",
    url_image: null
  },
  {
    name: "Samsung Galaxy S23",
    price: 950,
    quantity: 3,
    categoryId: "Electronics",
    url_image: null
  },
  {
    name: "Nike Air Force 1",
    price: 120,
    quantity: 20,
    categoryId: "Fashion",
    url_image: null
  },
  {
    name: "Hoodie Unisex",
    price: 45,
    quantity: 0,
    categoryId: "Fashion",
    url_image: null
  },
  {
    name: "Philips Air Fryer",
    price: 180,
    quantity: 4,
    categoryId: "Home",
    url_image: null
  }
];

(async () => {
  for (const p of products) {
    await ddb.send(new PutCommand({
      TableName: TABLE,
      Item: {
        id: uuidv4(),
        ...p,
        isDeleted: false,
        createdAt: new Date().toISOString()
      }
    }));
  }
  console.log("Seed products DONE");
})();
