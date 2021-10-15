//const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  await deploy("DevToken", {
    from: deployer,
    log: true,
  });
};
module.exports.tags = ["DEV"];
