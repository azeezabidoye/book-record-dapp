const { verify } = require("../hardhat.config.cjs");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const bookRecord = await deploy("BookRecord", {
    contract: "BookRecord",
    from: deployer,
    log: true, // Logs statements to console
  });

  if (process.env.ETHERSCAN_API_KEY) {
    await verify(bookRecord.address);
  }
  log("Contract verification successful...");
  log("............................................................");
};
module.exports.tags = ["BookRecord"];
