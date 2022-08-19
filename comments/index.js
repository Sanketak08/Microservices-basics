const express = require("express");
const { randomBytes } = require("crypto");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

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
app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;
  const { id } = req.params;

  const comments = commentsByPostID[id] || [];

  comments.push({ id: commentId, content });
  commentsByPostID[id] = comments;

  await axios.post("http://localhost:4005/events", {
    type: "COMMENT_ADDED",
    data: { id: commentId, content, postId: id },
  });

  res.status(201).send(comments);
});

app.post("/events", (req, res) => {
  console.log("Event Received: ", req.body.type);
  res.send({ status: "OK" });
});

app.listen(4001, () => {
  console.log("Server is running on port 4001");
});
