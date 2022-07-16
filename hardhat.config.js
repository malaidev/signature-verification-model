require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-gas-reporter");

require('dotenv').config()


// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.0",
  networks: {
    bsctest: {
      url: process.env.BSCTEST_RPC_URL || "",
      accounts: !!process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
    },
  },
  gasReporter: {
    enabled: true,
    gasPriceApi: "https://api.etherscan.io/api?module=proxy&action=eth_gasPrice",
    currency: 'USD',
    coinmarketcap: process.env.CMC_APIKEY
  },
  etherscan: {
    apiKey: {
      bscTestnet: process.env.BSCSCAN_API
    }
  },
};
