const express = require("express");
const cors = require("cors");
const needle = require("needle");
require("dotenv").config();
const port = process.env.PORT || 3002;
const app = express();
app.use(express.json());
app.use(cors());

// store in env file local
const token = process.env.BEARER_TOKEN;

//SAEI user ID in Twitter account
const userId = process.env.ID;

app.get("/get-tweets", (req, res) => {
  (async () => {
    (async () => {
      try {
        // Make request
        const response = await getRequest();
        console.log("RESPONSE", response, {
          depth: null,
        });
        res.status(200).json({
          data: response,
        });
      } catch (e) {
        console.log("error");
        console.log(e);
      }
    })();
  })();
});

app.get("/twitter-feed", (req, res) => {
  (async () => {
    (async () => {
      try {
        // Make request
        const response = await getRequestFeed();
        console.log("RESPONSE", response, {
          depth: null,
        });
        res.status(200).json({
          dataFeed: response,
        });
      } catch (e) {
        console.log("error");
        console.log(e);
      }
    })();
  })();
});

// Search for Tweets within the past seven days
// https://developer.twitter.com/en/docs/twitter-api/tweets/search/quick-start/recent-search

const endpointUrl = "https://api.twitter.com/2/tweets/search/recent";

async function getRequest() {
  const params = {
    query: "from:SAEIMEDIA lang:en",
    expansions: "attachments.media_keys",
    "media.fields": "preview_image_url,url,width,alt_text",
    "tweet.fields": "created_at",
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

// Get User Tweet timeline by user ID
// https://developer.twitter.com/en/docs/twitter-api/tweets/timelines/quick-start

const endpointUrlFeed = `https://api.twitter.com/2/users/${userId}/tweets`;
async function getRequestFeed() {
  const params = {
    expansions: "author_id",
    max_results: 7,
  };

  const res = await needle("get", endpointUrlFeed, params, {
    headers: {
      "User-Agent": "v2UserTweetsJS",
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
