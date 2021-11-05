module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  await deploy("CreateCall", {
    from: deployer,
    args: [],
    log: true,
    deterministicDeployment: true,
  });
  await deploy("MultiSend", {
    from: deployer,
    args: [],
    log: true,
    deterministicDeployment: true,
  });
  await deploy("MultiSendCallOnly", {
    from: deployer,
    args: [],
    log: true,
    deterministicDeployment: true,
  });
  await deploy("SignMessageLib", {
    from: deployer,
    args: [],
    log: true,
    deterministicDeployment: true,
  });
};
module.exports.tags = ['libraries', 'l2-suite', 'main-suite', 'LIB'];
