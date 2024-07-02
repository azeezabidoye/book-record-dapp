const { verify } = require("../utils/verify.cjs");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const bookRecord = await deploy("BookRecord", {
    contract: "BookRecord",
    args: [],
    from: deployer,
    log: true, // Logs statements to console
  });

  if (process.env.ETHERSCAN_API_KEY) {
    await verify(bookRecord.target, args);
  }
  log("Contract verification successful...");
  log("............................................................");
};
module.exports.tags = ["BookRecord"];
