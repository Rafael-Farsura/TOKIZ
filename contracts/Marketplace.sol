// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Marketplace is ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;

    constructor() ERC721("Marketplace", "MKT") Ownable(msg.sender) {}

    function mintImovel(address to) public onlyOwner returns (uint256) {
        _tokenIdCounter += 1;
        _mint(to, _tokenIdCounter);
        return _tokenIdCounter;
    }

    function setTokenURI(
        uint256 tokenId,
        string memory tokenURI
    ) public onlyOwner {
        _setTokenURI(tokenId, tokenURI);
    }
}
