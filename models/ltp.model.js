const mongoose = require("mongoose");

const LtpSchema = new mongoose.Schema({
  x3DTokenPrice: Number,
  xenTokenPrice: Number,
  date: { type: Date, default: Date.now() },
});

const LtPrice = new mongoose.model("lasttradingprice", LtpSchema);

module.exports = LtPrice;
