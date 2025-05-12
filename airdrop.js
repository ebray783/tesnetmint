// Import ethers.js
const { ethers } = window;

// Configuration object (ensure this is declared only once)
const config = {
  tokenContract: {
    address: "0x648Da88CDf8A2936933e1B5d72526Fd4aF3e129E", // Replace with your token contract address
    abi:  [
      {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "spender",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "Approval",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          }
        ],
        "name": "NFTTransfer",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "previousOwner",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "Transfer",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          }
        ],
        "name": "airdropNFT",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address[]",
            "name": "recipients",
            "type": "address[]"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "airdropTokens",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "spender",
            "type": "address"
          }
        ],
        "name": "allowance",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "spender",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "approve",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "account",
            "type": "address"
          }
        ],
        "name": "balanceOf",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address[]",
            "name": "recipients",
            "type": "address[]"
          }
        ],
        "name": "bulkAirdropNFT",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "decimals",
        "outputs": [
          {
            "internalType": "uint8",
            "name": "",
            "type": "uint8"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "spender",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "subtractedValue",
            "type": "uint256"
          }
        ],
        "name": "decreaseAllowance",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "user",
            "type": "address"
          }
        ],
        "name": "getNFTsOwned",
        "outputs": [
          {
            "internalType": "uint256[]",
            "name": "",
            "type": "uint256[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "spender",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "addedValue",
            "type": "uint256"
          }
        ],
        "name": "increaseAllowance",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "maxNFTSupply",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "mintNFT",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "name",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "ownerAddr",
            "type": "address"
          }
        ],
        "name": "nftBalanceOf",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "nftOwners",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "nftPrice",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "owner",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          }
        ],
        "name": "ownerOf",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "uri",
            "type": "string"
          }
        ],
        "name": "setBaseURI",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "newPrice",
            "type": "uint256"
          }
        ],
        "name": "setMintPrice",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "symbol",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          }
        ],
        "name": "tokenURI",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "totalNFTsMinted",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "transfer",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "transferFrom",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          }
        ],
        "name": "transferNFT",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "stateMutability": "payable",
        "type": "receive"
      }
    ],
  },
  airdropContract: {
    address: "0xbdd279ae0F42D7c0151CeD69cf519a3b9C6557C1", // Replace with your airdrop contract address
    abi: [
      {
        inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
        name: "claimAirdrop",
        outputs: [],
        stateMutability: "payable",
        type: "function"
      },
      {
        inputs: [{ internalType: "address", name: "account", type: "address" }],
        name: "hasPurchasedNFT",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [{ internalType: "address", name: "to", type: "address" }],
        name: "airdropNFT",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [
          { internalType: "address[]", name: "recipients", type: "address[]" }
        ],
        name: "bulkAirdropNFT",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        inputs: [
          { internalType: "address[]", name: "recipients", type: "address[]" },
          { internalType: "uint256", name: "amount", type: "uint256" }
        ],
        name: "airdropTokens",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      }
    ],
    feeWallet: "0x81acaa9f119C3Df8B14E5bad0fB08E5e61d4e4C4",
    claimFee: ethers.utils.parseEther("0.01") // Ensure ethers.utils is defined
  }
};

console.log("Config:", config);
// Utility function to update the status on the UI
function updateStatus(message, type = "info") {
  const statusEl = document.getElementById("status");
  if (statusEl) {
    statusEl.textContent = message;
    statusEl.className = type;
  }
}

// Claim Airdrop Function
async function claimAirdrop(amount) {
  try {
    if (!ethers) throw new Error("Ethers.js is not loaded");

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      config.airdropContract.address,
      config.airdropContract.abi,
      signer
    );

    const userAddress = await signer.getAddress();

    // Check if the user has purchased an NFT
    const hasNFT = await contract.hasPurchasedNFT(userAddress);

    let tx;
    if (hasNFT) {
      // No fee for NFT holders
      tx = await contract.claimAirdrop(amount);
      updateStatus("Claim transaction sent (no fee). Waiting for confirmation...", "info");
    } else {
      // Include fee for non-NFT holders
      tx = await contract.claimAirdrop(amount, { value: config.claimFee });
      updateStatus("Claim transaction sent (with fee). Waiting for confirmation...", "info");
    }

    await tx.wait();
    updateStatus("✅ Airdrop successfully claimed!", "success");
  } catch (err) {
    console.error(err);
    updateStatus(`❌ Error: ${err.message}`, "error");
  }
}

// Airdrop NFTs to a single address
async function airdropNFT(toAddress) {
  try {
    if (!ethers) throw new Error("Ethers.js is not loaded");

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      config.airdropContract.address,
      config.airdropContract.abi,
      signer
    );

    const tx = await contract.airdropNFT(toAddress);
    updateStatus("Airdrop transaction sent. Waiting for confirmation...", "info");

    await tx.wait();
    updateStatus("✅ NFT successfully airdropped!", "success");
  } catch (err) {
    console.error(err);
    updateStatus(`❌ Error: ${err.message}`, "error");
  }
}

// Bulk airdrop NFTs to multiple addresses
async function bulkAirdropNFT(recipients) {
  try {
    if (!ethers) throw new Error("Ethers.js is not loaded");

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      config.airdropContract.address,
      config.airdropContract.abi,
      signer
    );

    const tx = await contract.bulkAirdropNFT(recipients);
    updateStatus("Bulk airdrop transaction sent. Waiting for confirmation...", "info");

    await tx.wait();
    updateStatus("✅ NFTs successfully airdropped to multiple addresses!", "success");
  } catch (err) {
    console.error(err);
    updateStatus(`❌ Error: ${err.message}`, "error");
  }
}

// Airdrop tokens to multiple addresses
async function airdropTokens(recipients, amount) {
  try {
    if (!ethers) throw new Error("Ethers.js is not loaded");

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      config.airdropContract.address,
      config.airdropContract.abi,
      signer
    );

    const parsedAmount = ethers.utils.parseUnits(amount, 18);
    const tx = await contract.airdropTokens(recipients, parsedAmount);
    updateStatus("Token airdrop transaction sent. Waiting for confirmation...", "info");

    await tx.wait();
    updateStatus("✅ Tokens successfully airdropped!", "success");
  } catch (err) {
    console.error(err);
    updateStatus(`❌ Error: ${err.message}`, "error");
  }
}

// Attach event listeners to buttons
document.addEventListener("DOMContentLoaded", () => {
  const claimAirdropBtn = document.getElementById("airdropNFTBtn");
  const bulkAirdropNFTBtn = document.getElementById("bulkAirdropNFTBtn");
  const airdropTokensBtn = document.getElementById("airdropTokensBtn");

  if (claimAirdropBtn) {
    claimAirdropBtn.onclick = async () => {
      const amount = document.getElementById("airdropAmount").value;
      if (amount) {
        await claimAirdrop(amount);
      } else {
        updateStatus("❌ Please enter a valid amount.", "error");
      }
    };
  }

  if (bulkAirdropNFTBtn) {
    bulkAirdropNFTBtn.onclick = async () => {
      const recipients = document.getElementById("bulkRecipients").value.split(",");
      if (recipients.length > 0) await bulkAirdropNFT(recipients);
      else updateStatus("❌ Please enter valid recipient addresses.", "error");
    };
  }

  if (airdropTokensBtn) {
    airdropTokensBtn.onclick = async () => {
      const recipients = document.getElementById("tokenRecipients").value.split(",");
      const amount = document.getElementById("tokenAmount").value;
      if (recipients.length > 0 && amount) await airdropTokens(recipients, amount);
      else updateStatus("❌ Please enter valid recipients and amount.", "error");
    };
  }
});