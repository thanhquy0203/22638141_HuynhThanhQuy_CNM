const { v4: uuidv4 } = require("uuid");
const repo = require("../repositories/productRepo");
const logRepo = require("../repositories/logRepo");
const s3 = require("../config/s3");
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");

function s3KeyFromUrl(url) {
  try {
    const u = new URL(url);
    return u.pathname.replace(/^\/+/, "");
  } catch { return null; }
}

async function list(params) { return repo.list(params); }
async function getById(id) { return repo.getById(id); }

async function create(data, userId) {
  const item = {
    id: uuidv4(),
    name: data.name,
    price: Number(data.price),
    quantity: Number(data.quantity),
    categoryId: data.categoryId || null,
    url_image: data.url_image || null,
    isDeleted: false,
    createdAt: new Date().toISOString()
  };
  await repo.create(item);
  await logRepo.writeLog({
    logId: uuidv4(),
    productId: item.id,
    action: "CREATE",
    userId,
    time: new Date().toISOString()
  });
}

async function update(id, data, userId) {
  await repo.update(id, data);
  await logRepo.writeLog({
    logId: uuidv4(),
    productId: id,
    action: "UPDATE",
    userId,
    time: new Date().toISOString()
  });
}

async function softDelete(id, userId, deleteS3Image = true) {
  const p = await repo.getById(id);
  if (!p) return;

  if (deleteS3Image && p.url_image) {
    const Key = s3KeyFromUrl(p.url_image);
    if (Key) {
      await s3.send(new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key
      }));
    }
  }

  await repo.softDelete(id);
  await logRepo.writeLog({
    logId: uuidv4(),
    productId: id,
    action: "DELETE",
    userId,
    time: new Date().toISOString()
  });
}

module.exports = { list, getById, create, update, softDelete };
