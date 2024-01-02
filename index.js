// Import packages
const express = require("express");
const { google } = require("googleapis");
require("dotenv").config();

// Middlewares
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  return res.send("welcome APP");
});

function extractChannelTitleFromCustomLink(url) {
  // Regular expression pattern to match YouTube custom channel URLs
  const customChannelUrlPattern =
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/@([a-zA-Z0-9_-]+)/;
  console.log("in the valid");
  // Use regular expression to find the channel title from the URL
  const match = customChannelUrlPattern.exec(url);
  console.log(match[1]);
  if (match) {
    const channelTitle = match[1];
    return channelTitle;
  } else {
    return null;
  }
}

const ytData = google.youtube({
  version: "v3",
  auth: process.env.API_KEY,
});

app.get("/channelstats", async (req, res) => {
  try {
    let get_channel_name;
    let search_response = [];
    let youtubeUrl = req.query.youtubeurl;

    console.log(youtubeUrl);

    if (youtubeUrl.includes("youtube")) {
      get_channel_name = extractChannelTitleFromCustomLink(youtubeUrl);

      console.log(get_channel_name);

      if (get_channel_name == null)
        return res.send({
          status: 500,
          message: "Please enter the correct youtube url",
          data: None,
        });
      else {
        console.log("in axios");
        search_response = await ytData.search.list({
          q: get_channel_name,
          part: "snippet",
          type: "channel",
          maxResults: 1,
        });
        console.log("search_response");

        if (search_response.data.items.length > 0) {
          let items = search_response.data.items[0];
          console.log(items);
          let response = {
            channel_logo: items["snippet"]["thumbnails"]["default"]["url"],
            channel_name: items["snippet"]["title"],
            channel_description: items["snippet"]["description"],
            yearly_earning: 212131,
          };

          return res.json({
            status: 200,
            message: "Channel information retrieved successfully",
            data: response,
          });
        }
      }
    } else
      return res.send({
        status: 500,
        message: "Please enter the youtube url",
        data: {},
      });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal Server Error",
      data: error.toString(),
    });
  }
});

// connection
const port = process.env.PORT || 9001;
app.listen(port, () => console.log(`Listening to port ${port}`));
