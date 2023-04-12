const express = require("express");
const cors = require("cors");
const needle = require("needle");
require("dotenv").config();
const port = process.env.PORT || 4000;
const app = express();
app.use(express.json());
app.use(cors());

const token = process.env.BEARER_TOKEN;
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

const endpointUrl = "https://api.twitter.com/2/tweets/search/recent";

async function getRequest() {
  const params = {
    query: "from:SAEIMEDIA lang:en",
    expansions: "attachments.media_keys",
    "media.fields": "preview_image_url,url,width,alt_text",
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
