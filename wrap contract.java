// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract YourMainContract is ERC20 {
    // Whitelist to track addresses eligible for airdrop
    mapping(address => bool) public eligibleForAirdrop;
    // Track if an address has already claimed the airdrop
    mapping(address => bool) public hasClaimed;

    // Fee details
    uint256 public feePercentage = 200;  // Fee is 2% by default (200 basis points)
    address public feeWallet;  // Wallet where the fee will go

    uint256 public nftPrice = 0.2 ether;  // Example NFT price to be used for whitelist eligibility

    // Address that can manage the contract (previously owner)
    address public manager;

    // Events for claiming and fee changes
    event AirdropClaimed(address indexed claimant, uint256 amountClaimed, uint256 feeTransferred);
    event FeePercentageUpdated(uint256 newFeePercentage);
    event ManagerUpdated(address newManager);

    // Modifier to check if the caller is the manager
    modifier onlyManager() {
        require(msg.sender == manager, "Not authorized");
        _;
    }

    // Constructor to set the fee wallet address and manager (who can control the contract)
    constructor(address _feeWallet) ERC20("AirdropToken", "ADT") {
        feeWallet = _feeWallet;
        manager = msg.sender;  // Set the contract creator as the manager
    }

    // 1. Add address to whitelist (if they have purchased an NFT)
    function addToWhitelist(address[] calldata recipients) external onlyManager {
        for (uint256 i = 0; i < recipients.length; i++) {
            eligibleForAirdrop[recipients[i]] = true;
        }
    }

    // 2. Remove from whitelist (optional)
    function removeFromWhitelist(address[] calldata recipients) external onlyManager {
        for (uint256 i = 0; i < recipients.length; i++) {
            eligibleForAirdrop[recipients[i]] = false;
        }
    }

    // 3. Claim airdrop with or without fee
    function claimAirdrop(uint256 amount) external {
        require(!hasClaimed[msg.sender], "You have already claimed your airdrop");

        uint256 fee = 0;
        uint256 totalAmountToClaim = amount;

        // Check if the address is not whitelisted; if so, apply the fee
        if (!eligibleForAirdrop[msg.sender]) {
            fee = (amount * feePercentage) / 10000;  // 2% fee in this example
            totalAmountToClaim = amount - fee;
        }

        // Mark the address as having claimed the airdrop
        hasClaimed[msg.sender] = true;

        // Transfer the tokens to the claimant
        _transfer(manager, msg.sender, totalAmountToClaim);

        // If there's a fee, transfer it to the fee wallet
        if (fee > 0) {
            _transfer(manager, feeWallet, fee);
        }

        // Emit the claim event
        emit AirdropClaimed(msg.sender, totalAmountToClaim, fee);
    }

    // 4. Simulate NFT purchase for whitelisting (a person can buy an NFT to be added to the whitelist)
    function purchaseNFT() external payable {
        require(msg.value == nftPrice, "Incorrect payment amount for NFT");

        // Add the buyer to the whitelist after purchasing the NFT
        eligibleForAirdrop[msg.sender] = true;
    }

    // 5. Allow manager to withdraw funds from contract
    function withdraw() external onlyManager {
        payable(manager).transfer(address(this).balance);
    }

    // 6. Function to set the fee percentage
    function setFeePercentage(uint256 newFeePercentage) external onlyManager {
        require(newFeePercentage <= 1000, "Fee cannot exceed 10%");
        feePercentage = newFeePercentage;

        // Emit the event to log the change
        emit FeePercentageUpdated(newFeePercentage);
    }

    // 7. Function to receive Ether (for purchasing NFTs)
    receive() external payable {}

    // 8. Update the manager address (only the current manager can do this)
    function updateManager(address newManager) external onlyManager {
        require(newManager != address(0), "New manager cannot be the zero address");
        manager = newManager;

        // Emit the event to log the manager update
        emit ManagerUpdated(newManager);
    }
}
