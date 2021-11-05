module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  await deploy("DefaultCallbackHandler", {
    from: deployer,
    args: [],
    log: true,
    deterministicDeployment: true,
  });
  await deploy("CompatibilityFallbackHandler", {
    from: deployer,
    args: [],
    log: true,
    deterministicDeployment: true,
  });
};
module.exports.tags = ['handlers', 'l2-suite', 'main-suite', 'HAND'];
