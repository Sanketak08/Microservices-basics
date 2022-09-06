const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
  if (type === "POST_ADDED") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }

  if (type === "COMMENT_ADDED") {
    const { id, postId, content, status } = data;
    posts[postId].comments.push({ id, content, status });
  }

  if (type === "COMMENT_UPDATED") {
    const { id, postId, content, status } = data;
    const comment = posts[postId].comments.find((comment) => {
      return comment.id === id;
    });

    comment.status = status;
    comment.content = content;
  }
};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;

  handleEvent(type, data);

  res.send({ status: "OK" });
});

app.listen(4002, async () => {
  console.log("Server is running on port 4002");

  const res = await axios.get("http://localhost:4005/events");

  res.data.forEach((event) => {
    console.log("Processing event: ", event.type);
    handleEvent(event.type, event.data);
  });
});
