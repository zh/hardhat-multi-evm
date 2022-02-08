const coinName = "ETH"; // change to "BCH", "FTM", "DEV" etc.
const DEBUG = true;

function debug(text) {
  if (DEBUG) {
    console.log(text);
  }
}

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
    console.log(
      "\n\n Sending " + amount + " " + coinName + " to " + taskArgs.account
    );
    const tx = {
      to: taskArgs.account,
      value: ethers.utils.parseEther(amount),
    };
    return send(ethers.provider.getSigner(), tx);
  });

module.exports = {};
