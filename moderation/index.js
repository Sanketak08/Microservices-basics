const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();

app.use(bodyParser.json());

app.post("/events", async (req, res) => {
  console.log("In events moderation");
  const { type, data } = req.body;

  if (type === "COMMENT_ADDED") {
    const status = data?.content.includes("orange") ? "rejected" : "approved";

    await axios.post("http://localhost:4005/events", {
      type: "COMMENT_MODERATED",
      data: {
        id: data.id,
        postId: data.postId,
        content: data.content,
        status,
      },
    });

    res.send({ status: "OK" });
  }
});

app.listen(4003, () => {
  console.log("Server is running on port 4003");
});
