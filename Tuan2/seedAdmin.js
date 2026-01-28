const bcrypt = require("bcrypt");
const db = require("./db/mysql");

(async () => {
  const username = "admin";
  const password = "123456";
  const hash = await bcrypt.hash(password, 10);

  await db.query(
    "INSERT INTO users(username, password_hash) VALUES (?, ?) ON DUPLICATE KEY UPDATE password_hash=?",
    [username, hash, hash]
  );

  console.log("✅ Admin created/updated: admin / 123456");
  process.exit(0);
})();
