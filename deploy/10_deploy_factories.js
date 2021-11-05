module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  await deploy("GnosisSafeProxyFactory", {
    from: deployer,
    args: [],
    log: true,
    deterministicDeployment: true,
  });
};
module.exports.tags = ['factory', 'l2-suite', 'main-suite', 'FACT'];
