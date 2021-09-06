/* eslint no-use-before-define: "warn" */
const fs = require("fs");
const chalk = require("chalk");
const { config, ethers } = require("hardhat");
const { utils } = require("ethers");
const R = require("ramda");
const { create } = require('ipfs-http-client');
require('dotenv').config()

const infuraUrl = process.env.INFURA_URL || 'https://ipfs.infura.io:5001';
const client = create(new URL(infuraUrl));


const delayMS = 1000; //sometimes xDAI needs a 6000ms break lol 😅

const main = async () => {
  // ADDRESS TO MINT TO:
  const toAddress = process.env.DEPLOYER;

  console.log("\n\n 🎫 Minting to " + toAddress + "...\n");

  const { deployer } = await getNamedAccounts();
  const hhat = await ethers.getContract("HardhatNFTs", deployer);

  const godzilla = {
    description: "Raaaar!",
    external_url: "https://austingriffith.com/portfolio/paintings/", // <-- this can link to a page for the specific file too
    image: "https://austingriffith.com/images/paintings/godzilla.jpg",
    name: "Godzilla",
    attributes: [
      {
        trait_type: "BackgroundColor",
        value: "orange",
      },
      {
        trait_type: "Eyes",
        value: "googly",
      },
      {
        trait_type: "Stamina",
        value: 99,
      },
    ],
  };

  const zebra = {
    description: "What is it so worried about?",
    external_url: "https://austingriffith.com/portfolio/paintings/", // <-- this can link to a page for the specific file too
    image: "https://austingriffith.com/images/paintings/zebra.jpg",
    name: "Zebra",
    attributes: [
      {
        trait_type: "BackgroundColor",
        value: "blue",
      },
      {
        trait_type: "Eyes",
        value: "googly",
      },
      {
        trait_type: "Stamina",
        value: 38,
      },
    ],
  };

  const animal = 'zebra';
  // const animal = 'godzilla';
  console.log("Uploading " + animal + "...");
  const { cid } = await client.add(JSON.stringify(zebra));
  // const { cid } = await client.add(JSON.stringify(godzilla));
  console.log("Minting " + animal + " with IPFS hash (" + cid + ")");

  await hhat.safeMint(toAddress, cid);
  await sleep(delayMS);

  console.log(
    "Transferring Ownership of HHAT NFT to " + toAddress + "..."
  );

  await hhat.transferOwnership(toAddress);
  await sleep(delayMS);
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
