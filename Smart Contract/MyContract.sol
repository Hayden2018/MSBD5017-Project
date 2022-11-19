// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts@4.8.0/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@4.8.0/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts@4.8.0/access/Ownable.sol";
import "@openzeppelin/contracts@4.8.0/utils/Counters.sol";

contract MyToken is ERC721, ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("MyToken", "MTK") {}

    function safeMint(address to) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }
    function safeTransferFrom(address from,
        address to,
        uint256 tokenId) 
        public
        onlyOwner
        override(ERC721,IERC721)
    {
        _approve(to,tokenId);
        _transfer(from, to, tokenId);
    }
    function allTokenOfOwner(address owner)  public view returns (uint[] memory)
    {
        uint total = balanceOf(owner);
        uint counter = 0;
        uint[] memory myArray = new uint[](total);
        for (uint i = 0; i < totalSupply(); i++) {
            if (_ownerOf(i)==owner) {
                myArray[counter] = i;
                counter++;
            }
        }
        return myArray;
    }
    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
