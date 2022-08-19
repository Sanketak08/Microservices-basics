const express = require("express");
const { randomBytes } = require("crypto");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Local storage for posts
const posts = {};

// To get all posts
app.get("/posts", (req, res) => {
  res.send(posts);
});

// To create a new post
app.post("/posts", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;
  posts[id] = { id, title };

  await axios.post("http://localhost:4005/events", {
    type: "POST_ADDED",
    data: { id, title },
  });

  res.status(201).send(posts[id]);
});

app.post("/events", (req, res) => {
  console.log("Event Received: ", req.body.type);
  res.send({ status: "OK" });
});

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
