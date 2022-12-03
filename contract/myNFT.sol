// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

struct token {
    uint256 id;
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
    }

    function mint(address owner, string memory image, string memory md5) external returns (uint256) {
        require(master == msg.sender);
        tokens[counter] = token(counter, owner, image, md5);
        balance[owner] += 1;
        counter += 1;
        return counter - 1;
    }

    function allTokenOfOwner(address owner)  public view returns (token[] memory) {

        token[] memory results = new token[](balance[owner]);
        uint256 c = 0;

        for (uint256 i = 1; i < counter; i++) {
            if (tokens[i].owner == owner) {
                results[c] = tokens[i];
                ++c;
            }
        }
        return results;
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