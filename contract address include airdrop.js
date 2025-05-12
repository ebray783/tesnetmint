// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

abstract contract Ownable {
    address private _owner;
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor() {
        _transferOwnership(msg.sender);
    }

    modifier onlyOwner() {
        require(owner() == msg.sender, "Ownable: caller is not the owner");
        _;
    }

    function owner() public view virtual returns (address) {
        return _owner;
    }

    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        _transferOwnership(newOwner);
    }

    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}

interface IERC20 {
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

contract dambi is IERC20, Ownable {
    // ERC20 variables
    string private _name = "fpvtoken";
    string private _symbol = "fpv";
    uint8 private _decimals = 18;
    uint256 private _totalSupply = 1000000000 * (10 ** 18);
    uint256 public tokensPerBNB = 1000 * 1e18; // Example: 1000 tokens per 1 BNB

    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;
    mapping(address => uint256) private _lastTxBlock;
    uint256 private _cooldownBlocks = 2;

    // NFT variables
    uint256 public nftPrice = 0.01 ether;
    uint256 public maxNFTSupply = 500;
    uint256 public totalNFTsMinted;
    mapping(uint256 => address) public nftOwners;
    string private baseTokenURI;
    event NFTTransfer(address indexed from, address indexed to, uint256 indexed tokenId);

    // Airdrop
    uint256 public claimFee = 0.01 ether;
    function setClaimFee(uint256 newFee) external onlyOwner {
        claimFee = newFee;
    }
    mapping(address => bool) public hasClaimed;
    event AirdropClaimed(address indexed claimant, uint256 amount, uint256 feePaid);

    // --- ERC20 Functions ---
    constructor() Ownable() {
        _balances[owner()] = _totalSupply;
        emit Transfer(address(0), owner(), _totalSupply);
    }

    function name() public view virtual returns (string memory) {
        return _name;
    }

    function symbol() public view virtual returns (string memory) {
        return _symbol;
    }

    function decimals() public view virtual returns (uint8) {
        return _decimals;
    }

    function totalSupply() public view virtual override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) public view virtual override returns (uint256) {
        return _balances[account];
    }

    function transfer(address to, uint256 amount) public virtual override returns (bool) {
        address ownerAddr = msg.sender;
        _transfer(ownerAddr, to, amount);
        return true;
    }

    function allowance(address ownerAddr, address spender) public view virtual override returns (uint256) {
        return _allowances[ownerAddr][spender];
    }

    function approve(address spender, uint256 amount) public virtual override returns (bool) {
        address ownerAddr = msg.sender;
        _approve(ownerAddr, spender, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) public virtual override returns (bool) {
        address spender = msg.sender;
        _spendAllowance(from, spender, amount);
        _transfer(from, to, amount);
        return true;
    }

    function increaseAllowance(address spender, uint256 addedValue) public virtual returns (bool) {
        address ownerAddr = msg.sender;
        _approve(ownerAddr, spender, allowance(ownerAddr, spender) + addedValue);
        return true;
    }

    function decreaseAllowance(address spender, uint256 subtractedValue) public virtual returns (bool) {
        address ownerAddr = msg.sender;
        uint256 currentAllowance = allowance(ownerAddr, spender);
        require(currentAllowance >= subtractedValue, "ERC20: decreased allowance below zero");
        unchecked {
            _approve(ownerAddr, spender, currentAllowance - subtractedValue);
        }
        return true;
    }

    function _transfer(address from, address to, uint256 amount) internal virtual {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");

        if (from != owner()) {
            require(_lastTxBlock[from] < block.number, "Anti-bot: wait for next block");
            _lastTxBlock[from] = block.number;
        }

        uint256 fromBalance = _balances[from];
        require(fromBalance >= amount, "ERC20: transfer amount exceeds balance");
        unchecked {
            _balances[from] = fromBalance - amount;
            _balances[to] += amount;
        }

        emit Transfer(from, to, amount);
    }

    function _approve(address ownerAddr, address spender, uint256 amount) internal virtual {
        require(ownerAddr != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowances[ownerAddr][spender] = amount;
        emit Approval(ownerAddr, spender, amount);
    }

    function _spendAllowance(address ownerAddr, address spender, uint256 amount) internal virtual {
        uint256 currentAllowance = allowance(ownerAddr, spender);
        if (currentAllowance != type(uint256).max) {
            require(currentAllowance >= amount, "ERC20: insufficient allowance");
            unchecked {
                _approve(ownerAddr, spender, currentAllowance - amount);
            }
        }
    }

    // --- NFT Functions ---
    function setBaseURI(string memory uri) external onlyOwner {
        baseTokenURI = uri;
    }

    function _baseURI() internal view returns (string memory) {
        return baseTokenURI;
    }

    function mintNFT() external payable {
        require(msg.value >= nftPrice, "Insufficient BNB sent");
        require(totalNFTsMinted < maxNFTSupply, "All NFTs have been minted");

        uint256 tokenId = totalNFTsMinted + 1;
        nftOwners[tokenId] = msg.sender;
        totalNFTsMinted++;

        emit NFTTransfer(address(0), msg.sender, tokenId);
        _transfer(owner(), msg.sender, 1000 * (10 ** uint256(_decimals)));
    }

    function ownsNFT(address user) public view returns (bool) {
        for (uint256 i = 1; i <= totalNFTsMinted; i++) {
            if (nftOwners[i] == user) {
                return true;
            }
        }
        return false;
    }

    function tokenURI(uint256 tokenId) public view returns (string memory) {
        require(tokenId > 0 && tokenId <= totalNFTsMinted, "Invalid tokenId");
        return string(abi.encodePacked(_baseURI(), uint2str(tokenId), ".json"));
    }

    function airdropNFT(address to) internal {
        require(totalNFTsMinted < maxNFTSupply, "All NFTs have been minted");
        require(to != address(0), "Invalid address");

        uint256 tokenId = totalNFTsMinted + 1;
        nftOwners[tokenId] = to;
        totalNFTsMinted++;

        emit NFTTransfer(address(0), to, tokenId);
        _transfer(owner(), to, 1000 * (10 ** uint256(_decimals)));
    }

    function bulkAirdropNFT(address[] calldata recipients) external onlyOwner {
        require(recipients.length > 0, "No recipients provided");
        for (uint256 i = 0; i < recipients.length; i++) {
            require(recipients[i] != address(0), "Invalid address");
            airdropNFT(recipients[i]);
        }
    }

    function getNFTsOwned(address user) public view returns (uint256[] memory) {
        uint256[] memory result = new uint256[](totalNFTsMinted);
        uint256 count = 0;
        for (uint256 i = 1; i <= totalNFTsMinted; i++) {
            if (nftOwners[i] == user) {
                result[count] = i;
                count++;
            }
        }
        // Resize array to actual count
        uint256[] memory owned = new uint256[](count);
        for (uint256 j = 0; j < count; j++) {
            owned[j] = result[j];
        }
        return owned;
    }

    function uint2str(uint256 _i) internal pure returns (string memory str) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 length;
        while (j != 0) {
            length++;
            j /= 10;
        }
        bytes memory bstr = new bytes(length);
        uint256 k = length;
        j = _i;
        while (j != 0) {
            bstr[--k] = bytes1(uint8(48 + j % 10));
            j /= 10;
        }
        str = string(bstr);
    }

    function ownerOf(uint256 tokenId) public view returns (address) {
        require(tokenId > 0 && tokenId <= totalNFTsMinted, "Invalid tokenId");
        return nftOwners[tokenId];
    }

    function nftBalanceOf(address ownerAddr) public view returns (uint256) {
        require(ownerAddr != address(0), "Zero address");
        uint256 count = 0;
        for (uint256 i = 1; i <= totalNFTsMinted; i++) {
            if (nftOwners[i] == ownerAddr) {
                count++;
            }
        }
        return count;
    }

    function transferNFT(address to, uint256 tokenId) external {
        require(to != address(0), "Invalid address");
        require(nftOwners[tokenId] == msg.sender, "Caller is not the owner");

        nftOwners[tokenId] = to;
        emit NFTTransfer(msg.sender, to, tokenId);
    }

    function setMintPrice(uint256 newPrice) external onlyOwner {
        nftPrice = newPrice;
    }
    // 2. Add this function to allow the owner to set the presale rate:
function setTokensPerBNB(uint256 newRate) external onlyOwner {
    tokensPerBNB = newRate;
}
// 3. Add this function to allow users to buy tokens with BNB:
function buyTokens() public payable {
    require(msg.value > 0, "Send BNB to buy tokens");
    uint256 tokensToBuy = (msg.value * tokensPerBNB) / 1 ether;
    require(_balances[owner()] >= tokensToBuy, "Not enough tokens for sale");
    _transfer(owner(), msg.sender, tokensToBuy);
}

// 4. (Optional) Add this function to allow the owner to withdraw BNB:
function withdrawBNB() external onlyOwner {
    payable(owner()).transfer(address(this).balance);
}


    // --- Airdrop Function ---
    function claimAirdrop(uint256 amount) external payable {
        require(!hasClaimed[msg.sender], "Already claimed");
        require(_balances[owner()] >= amount, "Not enough tokens");

        uint256 fee = 0;
        if (!ownsNFT(msg.sender)) {
            require(msg.value >= claimFee, "Airdrop fee required");
            fee = msg.value;
            payable(owner()).transfer(fee);
        }

        hasClaimed[msg.sender] = true;
        _transfer(owner(), msg.sender, amount);
        emit AirdropClaimed(msg.sender, amount, fee);
    }

    // --- Withdraw ---
    function withdraw() external onlyOwner {
        uint256 contractBalance = address(this).balance;
        require(contractBalance > 0, "No BNB to withdraw");
        payable(owner()).transfer(contractBalance);
    }

 

    receive() external payable {}
}

