const { ethers } = require("hardhat");

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

async function main() {
  const SignatureVerifier = await ethers.getContractFactory("SignatureVerifier");
  const verifier = await (await SignatureVerifier.deploy(ZERO_ADDRESS)).deployed();

  console.log("SignatureVerifier deployed to:", verifier.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });