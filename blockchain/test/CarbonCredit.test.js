const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CarbonCredit", function () {
  let carbonCredit;
  let owner;
  let verifier;
  let user;
  let addrs;

  beforeEach(async function () {
    // Deploy the contract
    const CarbonCredit = await ethers.getContractFactory("CarbonCredit");
    [owner, verifier, user, ...addrs] = await ethers.getSigners();
    carbonCredit = await CarbonCredit.deploy();
    await carbonCredit.deployed();

    // Add a verifier
    await carbonCredit.addVerifier(verifier.address);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await carbonCredit.owner()).to.equal(owner.address);
    });

    it("Should register the verifier correctly", async function () {
      expect(await carbonCredit.verifiers(verifier.address)).to.equal(true);
    });
  });

  describe("Minting", function () {
    it("Should mint a new carbon credit", async function () {
      const tx = await carbonCredit.mintCredit(
        user.address,
        "site_001",
        100, // 100 tons of carbon
        2023, // vintage year
        "Brazil",
        "https://example.com/metadata/1"
      );

      // Wait for the transaction
      const receipt = await tx.wait();

      // Get the token ID from the event
      const event = receipt.events?.find((e) => e.event === "CreditMinted");
      const tokenId = event?.args?.tokenId;

      // Check the credit details
      const credit = await carbonCredit.getCreditDetails(tokenId);
      expect(credit.siteId).to.equal("site_001");
      expect(credit.amount).to.equal(100);
      expect(credit.vintage).to.equal(2023);
      expect(credit.region).to.equal("Brazil");
      expect(credit.status).to.equal(0); // Pending
    });
  });

  describe("Verification", function () {
    let tokenId;

    beforeEach(async function () {
      // Mint a credit first
      const tx = await carbonCredit.mintCredit(
        user.address,
        "site_001",
        100,
        2023,
        "Brazil",
        "https://example.com/metadata/1"
      );
      const receipt = await tx.wait();
      const event = receipt.events?.find((e) => e.event === "CreditMinted");
      tokenId = event?.args?.tokenId;
    });

    it("Should verify a carbon credit", async function () {
      // Verify the credit as the verifier
      await carbonCredit.connect(verifier).verifyCredit(tokenId);

      // Check the credit status
      const credit = await carbonCredit.getCreditDetails(tokenId);
      expect(credit.status).to.equal(1); // Verified
      expect(credit.verifiedDate).to.not.equal(0);
    });

    it("Should fail if not a verifier", async function () {
      // Try to verify as a regular user
      await expect(
        carbonCredit.connect(user).verifyCredit(tokenId)
      ).to.be.revertedWith("Not authorized");
    });
  });

  describe("Retiring", function () {
    let tokenId;

    beforeEach(async function () {
      // Mint a credit
      const tx = await carbonCredit.mintCredit(
        user.address,
        "site_001",
        100,
        2023,
        "Brazil",
        "https://example.com/metadata/1"
      );
      const receipt = await tx.wait();
      const event = receipt.events?.find((e) => e.event === "CreditMinted");
      tokenId = event?.args?.tokenId;

      // Verify the credit
      await carbonCredit.connect(verifier).verifyCredit(tokenId);
    });

    it("Should retire a carbon credit", async function () {
      // Retire the credit as the owner of the token
      await carbonCredit.connect(user).retireCredit(tokenId);

      // Check the credit status
      const credit = await carbonCredit.getCreditDetails(tokenId);
      expect(credit.status).to.equal(2); // Retired
    });

    it("Should fail if not the token owner", async function () {
      // Try to retire as someone else
      await expect(
        carbonCredit.connect(addrs[0]).retireCredit(tokenId)
      ).to.be.revertedWith("Not the owner");
    });
  });
});
