module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  await deploy("GnosisSafeL2", {
    from: deployer,
    args: [],
    log: true,
    deterministicDeployment: true,
  });
};
module.exports.tags = ['l2', 'l2-suite', 'main-suite', 'L2'];
