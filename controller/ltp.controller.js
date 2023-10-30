const ethers = require("ethers");
const axios = require("axios");
const {
  getXENTokenPrice,
  getXen3DTotalSupply,
  getXenBalanceX3D,
} = require("../web3/contracts");
const LtPrice = require("../models/ltp.model");
require("dotenv").config();
const providerUrl = process.env.RPC;
const provider = new ethers.providers.JsonRpcProvider(providerUrl);

const saveTradingPrice = async (req, res) => {
  console.log("Running...");
  const xenBalanceInX3D = await getXenBalanceX3D(provider);
  const data = await axios.get(
    "https://min-api.cryptocompare.com/data/price?fsym=XEN&tsyms=USD&api=b5baa8a285ba5b72a8e23bf83c9df6767b1c2a3f0cc29112052eb6e81ad9eb62"
  );
  const xenTokenPrice = data.data.USD;
  const xen3DSupply = await getXen3DTotalSupply(provider);

  const todayPrice =
    (parseFloat(xenBalanceInX3D) * xenTokenPrice) / parseFloat(xen3DSupply);
  let saveData;
  const isExist = await LtPrice.find();
  if (isExist.length > 0) {
    saveData = await LtPrice.findByIdAndUpdate(
      { _id: isExist[0]._id },
      {
        x3DTokenPrice: todayPrice,
        xenTokenPrice: xenTokenPrice,
        date: Date.now(),
      }
    );
  } else {
    saveData = await LtPrice.create({
      x3DTokenPrice: todayPrice,
      xenTokenPrice: xenTokenPrice,
      date: Date.now(),
    });
  }
  return res.status(200).json({
    status: "success",
    price: saveData,
  });
};

const getLastPrice = async (req, res) => {
  const lastPrice = await LtPrice.find();
  return res.status(200).json({
    status: "success",
    price: lastPrice,
  });
};

module.exports = {
  saveTradingPrice,
  getLastPrice,
};
