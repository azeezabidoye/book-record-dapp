module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  await deploy("BookRecord", {
    contract: "BookRecord",
    from: deployer,
    log: true, // Logs statements to console
  });
};
module.exports.tags = ["BookRecord"];
