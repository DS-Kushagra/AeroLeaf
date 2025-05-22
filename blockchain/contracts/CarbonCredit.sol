// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title CarbonCredit
 * @dev Contract for creating and managing carbon credits as NFTs
 */
contract CarbonCredit is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Credit status
    enum CreditStatus { Pending, Verified, Retired }

    // Credit struct
    struct Credit {
        uint256 tokenId;
        string siteId;
        uint256 amount; // Carbon in tons
        uint256 vintage; // Year
        string region;
        CreditStatus status;
        uint256 verifiedDate;
    }

    // Verifier role
    mapping(address => bool) public verifiers;

    // Token ID to Credit mapping
    mapping(uint256 => Credit) public credits;

    // Events
    event CreditMinted(uint256 indexed tokenId, string siteId, uint256 amount);
    event CreditVerified(uint256 indexed tokenId, address verifier);
    event CreditRetired(uint256 indexed tokenId, address retiredBy);
    event VerifierAdded(address verifier);
    event VerifierRemoved(address verifier);

    /**
     * @dev Constructor
     */
    constructor() ERC721("AeroLeaf Carbon Credit", "ALCC") {}

    /**
     * @dev Add a new verifier
     * @param _verifier The address of the verifier
     */
    function addVerifier(address _verifier) external onlyOwner {
        require(_verifier != address(0), "Invalid address");
        require(!verifiers[_verifier], "Already a verifier");
        
        verifiers[_verifier] = true;
        
        emit VerifierAdded(_verifier);
    }

    /**
     * @dev Remove a verifier
     * @param _verifier The address of the verifier
     */
    function removeVerifier(address _verifier) external onlyOwner {
        require(verifiers[_verifier], "Not a verifier");
        
        verifiers[_verifier] = false;
        
        emit VerifierRemoved(_verifier);
    }

    /**
     * @dev Mint a new carbon credit
     * @param _to The address to mint the token to
     * @param _siteId The ID of the reforestation site
     * @param _amount The amount of carbon in tons
     * @param _vintage The year of the credit
     * @param _region The region of the credit
     * @param _uri The token URI for metadata
     * @return uint256 The ID of the new token
     */
    function mintCredit(
        address _to,
        string memory _siteId,
        uint256 _amount,
        uint256 _vintage,
        string memory _region,
        string memory _uri
    ) external onlyOwner returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        _mint(_to, newTokenId);
        _setTokenURI(newTokenId, _uri);
        
        credits[newTokenId] = Credit({
            tokenId: newTokenId,
            siteId: _siteId,
            amount: _amount,
            vintage: _vintage,
            region: _region,
            status: CreditStatus.Pending,
            verifiedDate: 0
        });
        
        emit CreditMinted(newTokenId, _siteId, _amount);
        
        return newTokenId;
    }

    /**
     * @dev Verify a carbon credit
     * @param _tokenId The ID of the token to verify
     */
    function verifyCredit(uint256 _tokenId) external {
        require(verifiers[msg.sender], "Not authorized");
        require(_exists(_tokenId), "Token doesn't exist");
        require(credits[_tokenId].status == CreditStatus.Pending, "Already verified");
        
        credits[_tokenId].status = CreditStatus.Verified;
        credits[_tokenId].verifiedDate = block.timestamp;
        
        emit CreditVerified(_tokenId, msg.sender);
    }

    /**
     * @dev Retire a carbon credit (use it to offset carbon)
     * @param _tokenId The ID of the token to retire
     */
    function retireCredit(uint256 _tokenId) external {
        require(ownerOf(_tokenId) == msg.sender, "Not the owner");
        require(credits[_tokenId].status == CreditStatus.Verified, "Not verified");
        
        credits[_tokenId].status = CreditStatus.Retired;
        
        emit CreditRetired(_tokenId, msg.sender);
    }

    /**
     * @dev Get credit details
     * @param _tokenId The ID of the token
     * @return Credit The credit details
     */
    function getCreditDetails(uint256 _tokenId) external view returns (Credit memory) {
        require(_exists(_tokenId), "Token doesn't exist");
        return credits[_tokenId];
    }
}
