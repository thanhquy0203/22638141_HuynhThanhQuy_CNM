const { v4: uuidv4 } = require("uuid");
const repo = require("../repositories/categoryRepo");

async function listAll() { return repo.listAll(); }
async function getById(id) { return repo.getById(id); }

async function create({ name, description }) {
  await repo.create({
    categoryId: uuidv4(),
    name,
    description: description || "",
    createdAt: new Date().toISOString()
  });
}

async function update(id, data) { return repo.update(id, data); }
async function remove(id) { return repo.remove(id); }

module.exports = { listAll, getById, create, update, remove };
