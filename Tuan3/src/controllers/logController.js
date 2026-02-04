const logRepo = require("../repositories/logRepo");

exports.list = async (req, res) => {
  const logs = await logRepo.listAll();
  res.render("logs/list", { logs });
};
