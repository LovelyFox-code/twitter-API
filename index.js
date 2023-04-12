const express = require("express");
const cors = require("cors");
const needle = require("needle");
require("dotenv").config();
const port = process.env.PORT || 4000;
const app = express();
app.use(express.json());
app.use(cors());

const token = process.env.BEARER_TOKEN;
app.use("/", (req, res) => {
  (async () => {
    res.send("Getting data...");
    (async () => {
      try {
        // Make request
        const response = await getRequest();
        console.log("RESPONSE", response, {
          depth: null,
        });
      } catch (e) {
        console.log(e);
        process.exit(-1);
      }
      process.exit();
    })();
  })();
});

const endpointUrl = "https://api.twitter.com/2/tweets/search/recent";

async function getRequest() {
  const params = {
    query: "from:twitterdev -is:retweet",
    "tweet.fields": "author_id",
  };

  const res = await needle("get", endpointUrl, params, {
    headers: {
      "User-Agent": "v2RecentSearchJS",
      authorization: `Bearer ${token}`,
    },
  });

  if (res.body) {
    return res.body;
  } else {
    throw new Error("Unsuccessful request");
  }
}

app.listen(port, () => {
  console.log("listening on port", port);
});

module.exports = app;
