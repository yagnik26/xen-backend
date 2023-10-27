const express = require("express");
require("dotenv").config();
const cors = require("cors");
const connectDB = require("./config/connectDB");
const ltpRouter = require("./router/ltp.route");

const app = express();

app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  res.send("working....");
});
app.use("/api", ltpRouter);

app.listen(process.env.PORT, () => {
  console.log("listening on port " + process.env.PORT);
  connectDB();
});
