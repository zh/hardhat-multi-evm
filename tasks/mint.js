const tokenName = "AwesomeToken";

task("mint", "Send ERC-20 tokens")
  .addParam("account", "The account's address")
  .addOptionalParam("amount", "Amount of tokens to send")
  .setAction(async (taskArgs, { ethers }) => {
    console.log("\n\n Minting to " + taskArgs.account + "...\n");

    const { deployer } = await getNamedAccounts();
    const contract = await ethers.getContract(tokenName, deployer);
    const amount = taskArgs.amount ? parseInt(taskArgs.amount, 10) : 10;
    await contract.transfer(
      taskArgs.account,
      ethers.utils.parseEther("" + amount)
    );
  });

module.exports = {};
