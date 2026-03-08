const todoModel = require("../models/todoModel");

exports.index = async (req, res) => {
  const todos = await todoModel.listTodos();
  res.render("index", { todos });
};

exports.add = async (req, res) => {
  const title = (req.body.title || "").trim();
  if (title) await todoModel.addTodo(title);
  res.redirect("/");
};

exports.toggle = async (req, res) => {
  const todoId = req.body.todoId;
  if (todoId) await todoModel.toggleTodo(todoId);
  res.redirect("/");
};