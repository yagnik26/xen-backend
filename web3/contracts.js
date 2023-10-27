const xenABI = require("./abis/XENCrypto.json");
const xen3DABI = require("./abis/Xen3D.json");
const xenDOGE = require("./abis/XENDoge.json");
const { ethers, providers } = require("ethers");
const { formatUnits, parseUnits } = require("ethers/lib/utils.js");

const contract = {
  xen3d: "0x0ef389a003a6836B9D126D8BcabA726e3FA74c41",
  xenDOGE: "0x51569C8e52D5D2601d0ae07107f0E7D5E7E32B1a",
  xen: "0xD38f772Fe098d5907A08B58d0Fcf44AB09622604",
};

const publicClientToProvider = (publicClient) => {
  const rpcUrl = publicClient.chain.rpcUrls.default.http[0];
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  return provider;
};
function walletClientToSigner(walletClient) {
  const { account, chain, transport } = walletClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new providers.Web3Provider(transport, network);
  const signer = provider.getSigner(account.address);
  return signer;
}

const getContracts = (address, abi, providerSigner) => {
  try {
    return new ethers.Contract(address, abi, providerSigner);
  } catch (error) {
    throw error;
  }
};

const getXenContract = (providerSigner) => {
  try {
    return getContracts(contract.xen, xenABI, providerSigner);
  } catch (error) {
    throw error;
  }
};

const getXen3DContract = (providerSigner) => {
  try {
    return getContracts(contract.xen3d, xen3DABI, providerSigner);
  } catch (error) {
    throw error;
  }
};

const getXenDogeContract = (providerSigner) => {
  try {
    return getContracts(contract.xenDOGE, xenDOGE, providerSigner);
  } catch (error) {
    throw error;
  }
};

const getXenTotalSupply = async (providerSigner) => {
  try {
    return formatUnits(
      (await getXenContract(providerSigner).totalSupply()).toString(),
      18
    );
  } catch (error) {
    throw error;
  }
};
const getXen3DBalance = async (providerSigner) => {
  try {
    return formatUnits(
      (
        await getXenContract(providerSigner).balanceOf(contract.xen3d)
      ).toString(),
      18
    );
  } catch (error) {
    throw error;
  }
};

const getXen3DTotalSupply = async (providerSigner) => {
  try {
    return formatUnits(
      (await getXen3DContract(providerSigner).totalSupply()).toString(),
      18
    );
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};
const getXenBalance = async (address, providerSigner) => {
  try {
    return formatUnits(
      (await getXen3DContract(providerSigner).balanceOf(address)).toString(),
      18
    );
  } catch (error) {
    throw error;
  }
};
const getXenBalanceX3D = async (providerSigner) => {
  try {
    return formatUnits(
      (
        await getXenContract(providerSigner).balanceOf(contract.xen3d)
      ).toString(),
      18
    );
  } catch (error) {
    throw error;
  }
};

const getXen3DDividends = async (bool, providerSigner) => {
  try {
    return formatUnits(
      (await getXen3DContract(providerSigner).myDividends(bool)).toString(),
      18
    );
  } catch (error) {
    throw error;
  }
};

const buyingPrice = async (providerSigner) => {
  try {
    const oneToken = parseUnits("1", 18);
    const xenToToken = await getXen3DContract(providerSigner).xenToTokens_(
      oneToken
    );
    return formatUnits(xenToToken, 18);
  } catch (error) {
    throw error;
  }
};

const xenToTokens_ = async (amount, providerSigner) => {
  try {
    const price = await getXen3DContract(providerSigner).xenToTokens_(
      parseUnits(amount, 18)
    );
    return formatUnits(price, 18);
  } catch (error) {
    throw error;
  }
};

const sellingPrice = async (providerSigner) => {
  try {
    const oneToken = parseUnits("1", 18);
    const xenToToken = await getXen3DContract(providerSigner).tokensToXEN_(
      oneToken
    );
    return formatUnits(xenToToken, 18);
  } catch (error) {
    throw error;
  }
};

const tokensToXEN_ = async (amount, providerSigner) => {
  try {
    const price = await getXen3DContract(providerSigner).tokensToXEN_(
      parseUnits(amount, 18)
    );
    return formatUnits(price, 18);
  } catch (error) {
    throw error;
  }
};

const payoutsTo_ = async (address, providerSigner) => {
  try {
    return formatUnits(
      (await getXen3DContract(providerSigner).dividendsOf(address)).toString(),
      18
    );
  } catch (error) {
    throw error;
  }
};

const handleApproval = async (amount, address, buyAddress, providerSigner) => {
  try {
    const oneToken = parseUnits(amount, 18);
    const allowance = await getXenContract(providerSigner).allowance(
      address,
      contract.xen3d
    );
    if (allowance.lt(oneToken)) {
      const tx = await getXenContract(providerSigner).approve(
        contract.xen3d,
        oneToken
      );
      await tx.wait();
      return;
    } else {
      const tx = await getXen3DContract(providerSigner).buy(
        buyAddress,
        oneToken
      );
      await tx.wait();
      return;
    }
  } catch (error) {
    throw error;
  }
};

const isApproved = async (amount, address, providerSigner) => {
  try {
    const oneToken = parseUnits(amount.toString(), 18);
    const allowance = await getXenContract(providerSigner).allowance(
      address,
      contract.xen3d
    );
    if (allowance.lt(oneToken)) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    throw error;
  }
};

const handleSellToken = async (amount, providerSigner) => {
  try {
    const oneToken = parseUnits(amount, 18);
    const tx = await getXen3DContract(providerSigner).sell(oneToken);
    await tx.wait();
    return;
  } catch (error) {
    throw error;
  }
};

const withdraw = async (providerSigner) => {
  try {
    const tx = await getXen3DContract(providerSigner).withdraw();
    await tx.wait();
    return;
  } catch (error) {
    throw error;
  }
};
const reinvest = async (providerSigner) => {
  try {
    const tx = await getXen3DContract(providerSigner).reinvest();
    await tx.wait();
    return;
  } catch (error) {
    throw error;
  }
};

const getXENTokenPrice = async () => {
  try {
    const response = await fetch(
      "https://min-api.cryptocompare.com/data/price?fsym=XEN&tsyms=USD&api=b5baa8a285ba5b72a8e23bf83c9df6767b1c2a3f0cc29112052eb6e81ad9eb62",
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    return data["USD"];
  } catch (error) {
    throw error;
  }
};

/*
    xen = getXenContract(provider)
    xen3D = getXen3DContract(provider)
    xenDOGE = getXenDogeContract(provider)

      const buyingPrice = async () => {
        const oneToken = parseUnits("1", 18);
        const xenToToken = await xen3d.xenToTokens_(oneToken);
        return formatUnits(xenToToken, 18);
    }

    const sellingPrice = async () => {
        const oneToken = parseUnits("1", 18);
        const xenToToken = await xen3d.tokensToXEN_(oneToken);
        return formatUnits(xenToToken, 18);
    }

    const xenToTokens_ = async (amount) => {
        const price = await xen3d.xenToTokens_(amount);
        return formatUnits(price, 18);
    }

    const tokensToXEN_ = async (amount) => {
        const price = await xen3d.tokensToXEN_(amount);
        return formatUnits(price, 18);
    }

    const xenBalance = async (address) => {
        const balanceOfXen = await xen.balanceOf(address);
        return formatUnits(balanceOfXen, 18);
    }

    const myDividends = async (address) => {
        const balanceOfXen = await xen3d.myDividends(false);
        return formatUnits(balanceOfXen, 18);
    }

    1) xen.totalSupply()
    2) bal = xen.balanceOf(user) => to display formatUnit(bal, 18);
    3) divident = xen3D.myDividents(false)
    4) xen3D.myDividents(false) - divident
    5) 1 X3D = buyingPrice() XEN
    6) xenToTokens_(inputAmount) 
    7) 1 XEN = sellingPrice() X3D
    8) tokenToXen_(inputAmount)
    9) same as (2)
    10) xen3d.payoutsTo_(user)
*/

module.exports = {
  contract,
  publicClientToProvider,
  walletClientToSigner,
  getXenTotalSupply,
  getXen3DBalance,
  getXen3DTotalSupply,
  getXenBalance,
  getXenBalanceX3D,
  getXen3DDividends,
  buyingPrice,
  xenToTokens_,
  sellingPrice,
  tokensToXEN_,
  payoutsTo_,
  handleApproval,
  isApproved,
  handleSellToken,
  withdraw,
  reinvest,
  getXENTokenPrice,
};
