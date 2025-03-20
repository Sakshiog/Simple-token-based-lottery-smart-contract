/ SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract NFTLottery {
    struct NFT {
        uint256 id;
        address owner;
    }

    // Counter for NFT token IDs
    uint256 private _tokenIds;

    // Lottery variables
    address[] public participants;
    uint256 public lotteryEndTime;
    uint256 public ticketPrice;

    // Mapping NFT owners to ensure uniqueness
    mapping(uint256 => address) public nftOwners;

    event TicketPurchased(address indexed buyer);
    event WinnerDeclared(address indexed winner, uint256 tokenId);

    constructor(uint256 _duration, uint256 _ticketPrice) {
        lotteryEndTime = block.timestamp + _duration;
        ticketPrice = _ticketPrice;
    }

    // Buy a lottery ticket
    function buyTicket() external payable {
        require(block.timestamp < lotteryEndTime, "Lottery has ended");
        require(msg.value == ticketPrice, "Incorrect ticket price");

        participants.push(msg.sender);
        emit TicketPurchased(msg.sender);
    }

    // Mint NFT for the winner
    function mintNFT(address winner) internal returns (uint256) {
        _tokenIds++;
        uint256 newTokenId = _tokenIds;
        nftOwners[newTokenId] = winner;
        return newTokenId;
    }

    // End the lottery and declare a winner
    function endLottery() external {
        require(block.timestamp >= lotteryEndTime, "Lottery is still ongoing");
        require(participants.length > 0, "No participants in the lottery");

        // Randomly select a winner
        address winner = participants[randomNumber() % participants.length];
        uint256 newTokenId = mintNFT(winner);

        emit WinnerDeclared(winner, newTokenId);

        // Reset lottery for the next round
        delete participants;
        lotteryEndTime = block.timestamp + 1 weeks; // Example for recurring lotteries
    }

    // Pseudo-random number generator (for demonstration purposes)
    function randomNumber() internal view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, participants.length)));
    }

    // Withdraw contract funds (onlyOwner)
    function withdrawFunds(address payable recipient) external {
        require(msg.sender == address(this), "Only contract itself can initiate withdrawal");
        recipient.transfer(address(this).balance);
    }
}
