// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 * @custom:dev-run-script ./scripts/deploy_with_ethers.ts
 */

struct token {
    address owner;
    string url;
    string md5;
}

contract myNFT {

    uint256 counter;
    address master;

    mapping(uint256 => token) tokens;
    mapping(address => uint256) balance;

    constructor() {
        counter = 1;
        master = msg.sender;
        tokens[counter] = token(master, "https://upload.wikimedia.org/wikipedia/commons/d/d0/Eth-diamond-rainbow.png", "f1e4763234ae9a865b54eaf89fff4638");
        balance[master] += 1;
        counter += 1;
    }

    function mint(address owner, string memory image, string memory md5) external returns (bool) {
        require(master == msg.sender);
        tokens[counter] = token(owner, image, md5);
        balance[owner] += 1;
        return true;
    }

    function balanceOf(address owner) external view returns (uint256) {
        return balance[owner];
    }

    function ownerOf(uint256 tokenId) external view returns (address) {
        return tokens[tokenId].owner;
    }

    function getTokenURL(uint256 tokenId) external view returns (string memory) {
        return tokens[tokenId].url;
    }

    function transferFrom(address from, address to, uint256 tokenId) external payable {
        require(tokens[tokenId].owner == msg.sender);
        require(tokens[tokenId].owner == from);
        tokens[tokenId].owner = to;
        balance[from] -= 1;
        balance[to] += 1;
    }

    function getToken(uint256 tokenId) external view returns (token memory) {
        return tokens[tokenId];
    }
}