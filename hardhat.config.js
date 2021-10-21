const { utils } = require("ethers");
const fs = require("fs");

require("@nomiclabs/hardhat-waffle");

require("hardhat-deploy");
require('dotenv').config()

const { isAddress, getAddress, formatUnits, parseUnits } = utils;

const defaultNetwork = process.env.NETWORK || "localhost";
const deployerAddress = process.env.DEPLOYER;
const infuraKey = process.env.INFURA_KEY;

const coinName = "ETH"; // change to "BCH", "FTM", "DEV" etc.
const tokenName = "AwesomeToken";

function mnemonic(network="mainnet") {
  try {
    const fileName = network === "mainnet" ? "mnemonic" : `mnemonic_${network}`
    return fs.readFileSync(`./${fileName}.txt`).toString().trim();
  } catch (e) {
    if (defaultNetwork !== "localhost") {
      console.log(
        "☢️ WARNING: No mnemonic file created for a deploy account. Try `npm run generate` and then `npm run account`."
      );
    }
  }
  return "";
}

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork,
  networks: {
    localhost: {
      url: "http://localhost:8545",
    },
    kovan: {
      url: "https://kovan.infura.io/v3/" + infuraKey,
      accounts: {
        mnemonic: mnemonic()
      }
    },
    testnetSmartBCH: {
      url: "http://35.220.203.194:8545", // "https://moeing.tech:9545",
      chainId: 10001,
      gasPrice: 1050000000,
      accounts: {
        mnemonic: mnemonic("testnet")
      }
    },
    mainnetSmartBCH: {
      url: "https://smartbch.greyh.at", // "https://global.uat.cash",
      chainId: 10000,
      gasPrice: 1050000000,
      accounts: {
        mnemonic: mnemonic()
      }
    },
    localAvalanche: {
      url: 'http://localhost:9650/ext/bc/C/rpc',
      gasPrice: 225000000000,
      chainId: 43112,
      accounts: [
        "0x56289e99c94b6912bfc12adc093c9b51124f0dc54ac7a766b2bc5ccf558d8027",
        "0x7b4198529994b0dc604278c99d153cfd069d594753d471171a1d102a10438e07",
        "0x15614556be13730e9e8d6eacc1603143e7b96987429df8726384c2ec4502ef6e",
        "0x31b571bf6894a248831ff937bb49f7754509fe93bbd2517c9c73c4144c0e97dc",
        "0x6934bef917e01692b789da754a0eae31a8536eb465e7bff752ea291dad88c675",
        "0xe700bdbdbc279b808b1ec45f8c2370e4616d3a02c336e68d85d4668e08f53cff",
        "0xbbc2865b76ba28016bc2255c7504d000e046ae01934b04c694592a6276988630",
        "0xcdbfd34f687ced8c6968854f8a99ae47712c4f4183b78dcc4a903d1bfe8cbf60",
        "0x86f78c5416151fe3546dece84fda4b4b1e36089f2dbc48496faf3a950f16157c",
        "0x750839e9dbbd2a0910efe40f50b2f3b2f2f59f5580bb4b83bd8c1201cf9a010a"
      ]
    },
    fujiAvalanche: {
      url: 'https://api.avax-test.network/ext/bc/C/rpc',
      gasPrice: 225000000000,
      chainId: 43113,
      accounts: {
        mnemonic: mnemonic("testnet")
      }
    },
    mainnetAvalanche: {
      url: 'https://api.avax.network/ext/bc/C/rpc',
      gasPrice: 225000000000,
      chainId: 43114,
      accounts: {
        mnemonic: mnemonic()
      }
    },
    testnetFantom: {
      url: 'https://rpc.testnet.fantom.network/',
      gasPrice: 1800000000,
      chainId: 4002,
      accounts: {
        mnemonic: mnemonic("testnet")
      }
    },
    fantomOpera: {
      url: 'https://rpc.ftm.tools/',
      gasPrice: 1600000000,
      chainId: 250,
      accounts: {
        mnemonic: mnemonic()
      }
    },
    moondev: {
      url: "http://127.0.0.1:9933",
      chainId: 1281,
      accounts: {
        mnemonic: mnemonic("moon"),
      },
    },
    moonbase: {
      url: "https://rpc.testnet.moonbeam.network",
      gasPrice: 1000000000,
      chainId: 1287,
      accounts: {
        mnemonic: mnemonic("testnet"),
      },
    },
    moonriver: {
      url: "https://rpc.moonriver.moonbeam.network",
      chainId: 1285,
      gasPrice: 1000000000,
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    testnetTomo: {
      url: "https://rpc.testnet.tomochain.com",
      chainId: 89,
      gasPrice: 250000000,
      accounts: {
        mnemonic: mnemonic("testnet"),
      },
    },
    mainnetTomo: {
      url: "https://rpc.tomochain.com",
      chainId: 88,
      gasPrice: 250000000,
      accounts: {
        mnemonic: mnemonic(),
      },
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.4",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.1",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.7.4",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.7.3",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      }
    ]
  },
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
      'kovan': deployerAddress,
      'mainnetSmartBCH': deployerAddress,
      'testnetSmartBCH': deployerAddress,
      'fujiAva': deployerAddress,
      'mainnetAva': deployerAddress,
      'testnetFantom': deployerAddress,
      'fantomOpera': deployerAddress
    },
  }
};

const DEBUG = true;

function debug(text) {
  if (DEBUG) {
    console.log(text);
  }
}

task(
  "generate",
  "Create a mnemonic for builder deploys",
  async (_, { ethers }) => {
    const bip39 = require("bip39");
    const hdkey = require("ethereumjs-wallet/hdkey");
    const mnemonic = bip39.generateMnemonic();
    if (DEBUG) console.log("mnemonic", mnemonic);
    const seed = await bip39.mnemonicToSeed(mnemonic);
    if (DEBUG) console.log("seed", seed);
    const hdwallet = hdkey.fromMasterSeed(seed);
    const wallet_hdpath = "m/44'/60'/0'/0/";
    const account_index = 0;
    let fullPath = wallet_hdpath + account_index;
    if (DEBUG) console.log("fullPath", fullPath);
    const wallet = hdwallet.derivePath(fullPath).getWallet();
    const privateKey = "0x" + wallet._privKey.toString("hex");
    if (DEBUG) console.log("privateKey", privateKey);
    var EthUtil = require("ethereumjs-util");
    const address =
      "0x" + EthUtil.privateToAddress(wallet._privKey).toString("hex");
    console.log(
      "🔐 Account Generated as " +
        address +
        " and set as mnemonic in packages/hardhat"
    );
    console.log(
      "💬 Use 'npm run account' to get more information about the deployment account."
    );

    fs.writeFileSync("./" + address + ".txt", mnemonic.toString());
    fs.writeFileSync("./mnemonic.txt", mnemonic.toString());
  }
);

task(
  "account",
  "Get balance informations for the deployment account.",
  async (_, { ethers }) => {
    const hdkey = require("ethereumjs-wallet/hdkey");
    const bip39 = require("bip39");
    let mnemonic = fs.readFileSync("./mnemonic.txt").toString().trim();
    if (DEBUG) console.log("mnemonic", mnemonic);
    const seed = await bip39.mnemonicToSeed(mnemonic);
    if (DEBUG) console.log("seed", seed);
    const hdwallet = hdkey.fromMasterSeed(seed);
    const wallet_hdpath = "m/44'/60'/0'/0/";
    const account_index = 0;
    let fullPath = wallet_hdpath + account_index;
    if (DEBUG) console.log("fullPath", fullPath);
    const wallet = hdwallet.derivePath(fullPath).getWallet();
    const privateKey = "0x" + wallet._privKey.toString("hex");
    if (DEBUG) console.log("privateKey", privateKey);
    var EthUtil = require("ethereumjs-util");
    const address =
      "0x" + EthUtil.privateToAddress(wallet._privKey).toString("hex");
    var qrcode = require("qrcode-terminal");
    qrcode.generate(address);
    console.log("📬 Deployer Account is " + address);
    for (let n in config.networks) {
      //console.log(config.networks[n],n)
      try {
        let provider = new ethers.providers.JsonRpcProvider(
          config.networks[n].url
        );
        let balance = await provider.getBalance(address);
        console.log(" -- " + n + " --  -- -- 📡 ");
        console.log("   balance: " + ethers.utils.formatEther(balance));
        console.log(
          "   nonce: " + (await provider.getTransactionCount(address))
        );
      } catch (e) {
        if (DEBUG) {
          console.log(e);
        }
      }
    }
  }
);

async function addr(ethers, addr) {
  if (isAddress(addr)) {
    return getAddress(addr);
  }
  const accounts = await ethers.provider.listAccounts();
  if (accounts[addr] !== undefined) {
    return accounts[addr];
  }
  throw `Could not normalize address: ${addr}`;
}

task("accounts", "Prints the list of accounts", async (_, { ethers }) => {
  const accounts = await ethers.provider.listAccounts();
  accounts.forEach((account) => console.log(account));
});

task("balance", "Prints an account's balance")
  .addPositionalParam("account", "The account's address")
  .setAction(async (taskArgs, { ethers }) => {
    const balance = await ethers.provider.getBalance(
      await addr(ethers, taskArgs.account)
    );
    console.log(formatUnits(balance, "ether"), "ETH");
  });

function send(signer, txparams) {
  return signer.sendTransaction(txparams, (error, transactionHash) => {
    if (error) {
      debug(`Error: ${error}`);
    }
    debug(`transactionHash: ${transactionHash}`);
    // checkForReceipt(2, params, transactionHash, resolve)
  });
}

task("fund", "Fund account")
  .addParam("account", "The account's address")
  .addOptionalParam("amount", "Amount of tokens to send")
  .setAction(async (taskArgs, { ethers }) => {
    const amount = taskArgs.amount ? taskArgs.amount : "1.0";
    console.log("\n\n Sending " + amount + " " + coinName + " to " + taskArgs.account);
    const tx = {
      to: taskArgs.account,
      value: ethers.utils.parseEther(amount)
    };
    return send(ethers.provider.getSigner(), tx);
  });

task("mint", "Send ERC-20 tokens")
  .addParam("account", "The account's address")
  .addOptionalParam("amount", "Amount of tokens to send")
  .setAction(async (taskArgs, { ethers }) => {
    console.log("\n\n Minting to " + taskArgs.account + "...\n");

    const { deployer } = await getNamedAccounts();
    const contract = await ethers.getContract(tokenName, deployer);
    const amount = taskArgs.amount ? parseInt(taskArgs.amount, 10) : 10;
    await contract.transfer(taskArgs.account, ethers.utils.parseEther("" + amount));
  });
