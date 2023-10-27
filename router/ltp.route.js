const router = require("express").Router();
const {
  saveTradingPrice,
  getLastPrice,
} = require("../controller/ltp.controller.js");

router.get("/todayTradingPrice", saveTradingPrice);
router.get("/lastPrice", getLastPrice);

module.exports = router;
