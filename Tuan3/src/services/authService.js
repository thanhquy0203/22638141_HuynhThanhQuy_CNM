const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const userRepo = require("../repositories/userRepo");

async function login(username, password) {
  const user = await userRepo.findByUsername(username);
  if (!user) return null;

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return null;

  return { userId: user.userId, username: user.username, role: user.role };
}

async function seedAdmin() {
  const exists = await userRepo.findByUsername("admin");
  if (exists) return;

  const hash = await bcrypt.hash("123456", 10);
  await userRepo.createUser({
    userId: uuidv4(),
    username: "admin",
    password: hash,
    role: "admin",
    createdAt: new Date().toISOString()
  });
}

module.exports = { login, seedAdmin };
