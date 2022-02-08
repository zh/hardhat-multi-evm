const fs = require("fs");

require("@nomiclabs/hardhat-waffle");

require("hardhat-deploy");
require("dotenv").config();

require("./tasks/generate");
require("./tasks/account");
require("./tasks/accounts");
require("./tasks/balance");
require("./tasks/fund");
require("./tasks/mint");
require("./tasks/tokens");

const defaultNetwork = process.env.NETWORK || "localhost";
const deployerAddress = process.env.DEPLOYER;
const infuraKey = process.env.INFURA_KEY;

function mnemonic(network = "mainnet") {
  try {
    const fileName = network === "mainnet" ? "mnemonic" : `mnemonic_${network}`;
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
 * @type import("hardhat/config").HardhatUserConfig
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
        mnemonic: mnemonic(),
      },
    },
    xdai: {
      url: "https://rpc.xdaichain.com/",
      chainId: 100,
      gasPrice: 1000000000,
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    polygon: {
      url: "https://polygon-rpc.com/",
      chainId: 137,
      gasPrice: 1000000000,
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com/",
      chainId: 80001,
      gasPrice: 1000000000,
      accounts: {
        mnemonic: mnemonic("testnet"),
      },
    },
    testnetSmartBCH: {
      url: "http://35.220.203.194:8545", // "https://moeing.tech:9545",
      chainId: 10001,
      gasPrice: 1050000000,
      accounts: {
        mnemonic: mnemonic("testnet"),
      },
    },
    mainnetSmartBCH: {
      url: "https://smartbch.greyh.at", // "https://global.uat.cash",
      chainId: 10000,
      gasPrice: 1050000000,
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    localAvalanche: {
      url: "http://localhost:9650/ext/bc/C/rpc",
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
        "0x750839e9dbbd2a0910efe40f50b2f3b2f2f59f5580bb4b83bd8c1201cf9a010a",
      ],
    },
    fujiAvalanche: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      gasPrice: 225000000000,
      chainId: 43113,
      accounts: {
        mnemonic: mnemonic("testnet"),
      },
    },
    mainnetAvalanche: {
      url: "https://api.avax.network/ext/bc/C/rpc",
      gasPrice: 225000000000,
      chainId: 43114,
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    testnetFantom: {
      url: "https://rpc.testnet.fantom.network/",
      gasPrice: 1800000000,
      chainId: 4002,
      accounts: {
        mnemonic: mnemonic("testnet"),
      },
    },
    fantomOpera: {
      url: "https://rpc.ftm.tools/",
      gasPrice: 1600000000,
      chainId: 250,
      accounts: {
        mnemonic: mnemonic(),
      },
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
    moonbeam: {
      url: "https://rpc.api.moonbeam.network",
      gasPrice: 1000000000,
      chainId: 1284,
      accounts: {
        mnemonic: mnemonic(),
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
    testnetHarmony: {
      url: "https://api.s0.b.hmny.io",
      gasPrice: 1000000000,
      chainId: 1666700000,
      accounts: {
        mnemonic: mnemonic("testnet"),
      },
    },
    mainnetHarmony: {
      url: "https://api.harmony.one",
      gasPrice: 1000000000,
      chainId: 1666600000,
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    testnetBSC: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      gasPrice: 20000000000,
      accounts: {
        mnemonic: mnemonic("testnet"),
      },
    },
    mainnetBSC: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      gasPrice: 20000000000,
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    testnetTelos: {
      url: "https://testnet.telos.net/evm",
      chainId: 41,
      gasPrice: 500000000000,
      accounts: {
        mnemonic: mnemonic("testnet"),
      },
    },
    mainnetTelos: {
      url: "https://mainnet.telos.net/evm",
      chainId: 40,
      gasPrice: 500000000000,
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    testnetAurora: {
      url: "https://testnet.aurora.dev",
      chainId: 1313161555,
      gasPrice: 120 * 1000000000,
      accounts: {
        mnemonic: mnemonic("testnet"),
      },
    },
    mainnetAurora: {
      url: "https://mainnet.aurora.dev",
      chainId: 1313161554,
      gasPrice: 120 * 1000000000,
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    bakerloo: {
      url: "https://rpc4.bakerloo.autonity.network:8545",
      chainId: 444900,
      gasPrice: 10000000000,
      accounts: {
        mnemonic: mnemonic("testnet"),
      },
    },
    kaleido: {
      url: `https://${process.env.KALEIDO_USER}:${process.env.KALEIDO_PASS}@${process.env.KALEIDO_URL}.kaleido.io/`,
      chainId: parseInt(process.env.KALEIDO_CHAINID, 10),
      gasPrice: 1000000000,
      accounts: {
        mnemonic: mnemonic("testnet"),
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
        version: "0.8.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.7.6",
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
      },
      {
        version: "0.6.12",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.5.17",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
      kovan: deployerAddress,
      mainnetSmartBCH: deployerAddress,
      testnetSmartBCH: deployerAddress,
      fujiAva: deployerAddress,
      mainnetAva: deployerAddress,
      testnetFantom: deployerAddress,
      fantomOpera: deployerAddress,
    },
  },
};
