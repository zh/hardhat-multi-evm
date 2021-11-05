module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  await deploy("GnosisSafe", {
    from: deployer,
    args: [],
    log: true,
    deterministicDeployment: true,
  });
};
module.exports.tags = ['singleton', 'main-suite', 'SINGLE'];
