const { expect } = require("chai");
const { ethers } = require("hardhat");
const { getSignatureFromPrivateKey } = require("../utils/sign");
const axios = require("axios").default;

require('dotenv').config()

describe("Testing with mocks", () => {

  const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
  const TEST_PARAM1 = 812983;
  const TEST_PARAM2 = "0x5Da470054Fb7Dfa4f608f28F5D6Ff117108719f0";
  const TEST_PARAM3 = "random_string_for_test";

  const SIGNER_ADDRESS = process.env.SIGNER_ADDRESS;
  const SIGNER_PRIVATE_KEY = process.env.SIGNER_PRIVATE_KEY;
  const WRONG_PRIVATE_KEY = "0x6dcdf55aae26fe4a2a1adb3aa07e89cf2305330e6da4afa010d6a5f21dacbb2f";
  
  let signers; 

  describe("Test Verifier", () => {
    
    before(async () => {

      [ _, ...signers ] = await ethers.getSigners();

      const SignatureVerifier = await ethers.getContractFactory("SignatureVerifier");
      verifier = await (await SignatureVerifier.deploy(ZERO_ADDRESS)).deployed();
    });

    it("deploys", async () => {
      expect(verifier.address).to.not.equal(ZERO_ADDRESS);
    });

    it("sets signer address", async () => {
      await (await verifier.setSigner(SIGNER_ADDRESS)).wait();
      expect(await verifier.getSigner()).to.equal(SIGNER_ADDRESS);
    });

    it("Transaction successful for a valid signer's signature", async () => {
      const { signature, nonce } = getSignatureFromPrivateKey(
        SIGNER_PRIVATE_KEY, 
        TEST_PARAM1, 
        TEST_PARAM2, 
        TEST_PARAM3
      );

      await expect(
        verifier.verify(
          TEST_PARAM1, 
          TEST_PARAM2, 
          TEST_PARAM3, 
          signature, 
          nonce
        )
      ).to.not.be.reverted;
    });

    it("Transaction reverted for an invalid signer's signature", async () => {
      const { signature, nonce } = getSignatureFromPrivateKey(
        WRONG_PRIVATE_KEY, 
        TEST_PARAM1, 
        TEST_PARAM2, 
        TEST_PARAM3
      );
      
      await expect(
        verifier.verify(
          TEST_PARAM1, 
          TEST_PARAM2, 
          TEST_PARAM3, 
          signature, 
          nonce
        )
      ).to.be.revertedWith("SignatureVerifier: invalid signature");
    });

    it("Transaction reverted for invalid params", async () => {
      const { signature, nonce } = getSignatureFromPrivateKey(
        SIGNER_PRIVATE_KEY, 
        TEST_PARAM1 + 1, 
        TEST_PARAM2, 
        TEST_PARAM3
      );

      await expect(
        verifier.verify(
          TEST_PARAM1, 
          TEST_PARAM2, 
          TEST_PARAM3, 
          signature, 
          nonce
        )
      ).to.be.revertedWith("SignatureVerifier: invalid signature");
    });
    
    it("Transaction reverted for reused signature", async () => {
      const { signature, nonce } = getSignatureFromPrivateKey(
        SIGNER_PRIVATE_KEY, 
        TEST_PARAM1, 
        TEST_PARAM2, 
        TEST_PARAM3
      );

      await expect(
        verifier.verify(
          TEST_PARAM1, 
          TEST_PARAM2, 
          TEST_PARAM3, 
          signature, 
          nonce
        )
      ).to.be.not.reverted;

      await expect(
        verifier.verify(
          TEST_PARAM1, 
          TEST_PARAM2, 
          TEST_PARAM3, 
          signature, 
          nonce + 1
        )
      ).to.be.revertedWith("SignatureVerifier: already used signature");
    });
    
    it("Transaction successful for a valid signer's signature fetched from API", async () => {
      const data = { params: [TEST_PARAM1, TEST_PARAM2, TEST_PARAM3] };
      const res = await axios.get('http://localhost:3000/signature-request', {params: data});
      const { signature, nonce } = res;

      await expect(
        verifier.verify(
          TEST_PARAM1, 
          TEST_PARAM2, 
          TEST_PARAM3, 
          signature, 
          nonce
        )
      ).to.not.be.reverted;
    });
  });
});
