// Import packages
const express = require("express");
require("dotenv").config();

// Middlewares
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  return res.send("WELCOME TO APP");
});


// connection
const port = process.env.PORT || 9001;
app.listen(port, () => console.log(`Listening to port ${port}`));
