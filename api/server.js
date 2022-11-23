const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");

const Todo = require("./models/Todo");

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

mongoose
  .connect("mongodb://127.0.0.1:27017/mern-todo", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected to db"))
  .catch((err) => console.log(err));

app.get("/todos", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.post("/todos/new", async (req, res) => {
  const todo = new Todo({
    text: req.body.text,
  });

  await todo.save();
  res.json(todo);
});

app.delete("/todos/delete/:id", async (req, res) => {
  const result = await Todo.findByIdAndDelete(req.params.id);
  res.json(result);
});

app.get("/todos/complete/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    todo.completed = !todo.completed;
    await todo.save();
    res.json(todo);
  } catch (err) {
    console.log(err);
  }
});

app.listen(3001, () => console.log("server started at port 3001"));
