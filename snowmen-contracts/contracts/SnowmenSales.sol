// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract SnowmenSales is Ownable, ERC1155Holder {
    using SafeERC20 for IERC20;

    IERC20 public snowmenToken;
    IERC1155 public snowmenGame;

    uint256 private constant TICKET_PRICE = 0.01 ether;
    uint256 private constant QUANTITY = 1;
    uint256 private constant TICKET_ID = 340282366920938463463374607431768211456;

    mapping(uint256 => uint256) public tokenPrice;

    event onERC1155ReceivedExecuted(
        address operator,
        address from,
        uint256 id,
        uint256 value
    );    

    event BuyItem(
        address indexed buyer,
        uint256 tokenId,
        uint256 amount,
        uint256 timestamp
    );

    event BuyTicket(address indexed buyer, uint256 timestamp);
    event SetPrice(uint256 tokenId, uint256 price, uint256 timestamp);
    event Withdraw(address owner, uint256 amount);

    constructor(address snowmenErc1155, address snowmenErc20) {
        snowmenGame = IERC1155(snowmenErc1155);
        snowmenToken = IERC20(snowmenErc20);
    }

    function onERC1155Received(
        address operator,
        address from,
        uint256 id,
        uint256 value,
        bytes memory
    ) public override returns (bytes4) {
        require(msg.sender == address(snowmenGame), "incorrect sender");
        require(value != 0, "quantity is zero");
        emit onERC1155ReceivedExecuted(operator, from, id, value);
        return this.onERC1155Received.selector;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC1155Receiver)
        returns (bool)
    {
        return
            interfaceId == type(IERC1155Receiver).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    function buyItem(uint256 tokenId, uint256 amount) external {
        address buyer = msg.sender;
        require(tokenPrice[tokenId] != 0, "price not set yet");
        require(amount >= tokenPrice[tokenId], "amount not enough");
        require(
            snowmenGame.balanceOf(address(this), tokenId) >= QUANTITY,
            "balance not enough"
        );
        require(snowmenToken.balanceOf(buyer) >= amount, "insufficient token");
        require(
            snowmenToken.allowance(buyer, address(this)) >= amount,
            "insufficient token approval"
        );

        snowmenToken.safeTransferFrom(buyer, owner(), amount);
        snowmenGame.safeTransferFrom(
            address(this),
            buyer,
            tokenId,
            QUANTITY,
            ""
        );

        emit BuyItem(buyer, tokenId, amount, block.timestamp);
    }

    function buyTicket() external payable {
        require(msg.value >= TICKET_PRICE, "price not enough");

        (bool success, ) = address(snowmenGame).call(
            abi.encodeWithSignature(
                "mint(address,uint256,uint256)",
                msg.sender,
                TICKET_ID,
                QUANTITY
            )
        );

        require(success, "mint failed");

        emit BuyTicket(msg.sender, block.timestamp);
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function setPrice(uint256 tokenId, uint256 price) external onlyOwner {
        require(tokenId != 0, "tokenId is zero");
        require(price != 0, "price is zero");
        tokenPrice[tokenId] = price;
        emit SetPrice(tokenId, price, block.timestamp);
    }

    function withdraw() external onlyOwner {
        uint256 amount = getBalance();
        require(amount != 0, "insufficient amount");
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "unable to withdraw eth");
        emit Withdraw(msg.sender, amount);
    }
}