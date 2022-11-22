// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

contract SnowmenGame is ERC1155Supply, Ownable {
    using Strings for uint256;
    using Counters for Counters.Counter;

    Counters.Counter public atFolderId;

    mapping(uint256 => string) private _metadataHash;
    mapping(address => bool) private _authorized;

    constructor() ERC1155("") {
        // Set atFolderId start to be 1 not 0
        atFolderId.increment();
    }

    function mint(
        address beneficiary,
        uint256 id,
        uint256 quantity
    ) external {
        require(
            _authorized[msg.sender] || owner() == msg.sender,
            "not authorized"
        );
        _mint(beneficiary, id, quantity, "");
        //require(msg.value >= 1e18, "price low");
    }

    function confirmUpload(string calldata ipfsHash) external onlyOwner {
        _metadataHash[atFolderId.current()] = ipfsHash;
        atFolderId.increment();
    }

    function getIds(uint16 quantity) external view returns (uint256[] memory) {
        uint256[] memory ids = new uint256[](quantity);

        for (uint16 i = 0; i < quantity; ++i) {
            uint256 tokenId = (atFolderId.current() << 128) | i;
            ids[i] = tokenId;
        }

        return ids;
    }

    function tokenToFolder(uint256 tokenId) public pure returns (uint256) {
        // Check the top bits to see if the folder id is there
       return tokenId >> 128;
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        require(exists(tokenId), "URI query for nonexistent token");
        return (
            string(
                abi.encodePacked(
                    "ipfs://",
                    _metadataHash[tokenToFolder(tokenId)],
                    "/",
                    Strings.toString(tokenId),
                    ".json"
                )
            )
        );
    }

    function addAuthorized(address authorized) external onlyOwner {
        _authorized[authorized] = true;
    }

    function removeAuthorized(address authorized) external onlyOwner {
        _authorized[authorized] = false;
    }
}
