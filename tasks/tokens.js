const tokenName = "AwesomeToken";
const tokenSymbol = "AWE";

task("tokens", "Balance of ERC-20 tokens")
  .addParam("account", "The account's address")
  .setAction(async (taskArgs, { ethers }) => {
    const { deployer } = await getNamedAccounts();
    const contract = await ethers.getContract(tokenName, deployer);
    const amount = await contract.balanceOf(taskArgs.account);
    console.log("\n\nBalance of " + taskArgs.account + " is " + ethers.utils.formatEther("" + amount) + " " + tokenSymbol);
  });

module.exports = {};
