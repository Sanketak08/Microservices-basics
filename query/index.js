const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;

  if (type === "POST_ADDED") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }

  if (type === "COMMENT_ADDED") {
    const { id, postId, content } = data;
    posts[postId].comments.push({ id, content });
  }

  console.log("All posts ->", posts);

  res.send({ status: "OK" });
});

app.listen(4002, () => {
  console.log("Server is running on port 4002");
});
