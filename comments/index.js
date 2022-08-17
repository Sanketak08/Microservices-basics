const express = require("express");
const { randomBytes } = require("crypto");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Local storage for comments
const commentsByPostID = {};

// To get all comments
app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostID[req.params.id] || []);
});

// To add a new comment
app.post("/posts/:id/comments", (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;
  const { id } = req.params;

  const comments = commentsByPostID[id] || [];

  comments.push({ id: commentId, content });
  commentsByPostID[id] = comments;

  res.status(201).send(comments);
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
