// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface ClaimToken {
    function balanceOf(address account) external view returns (uint256);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
}

contract ClaimEscrow {
    enum State { None, Opened, Paid, Rejected }

    struct Claim {
        bytes32 packHash;
        address payee;
        uint256 amount;
        State state;
    }

    address public immutable owner;
    ClaimToken public immutable token;
    address public insurer;
    address public platform;
    uint256 public availableFloat;
    uint256 public reservedFloat;
    uint256 public claimCount;
    mapping(uint256 => Claim) public claims;
    mapping(bytes32 => uint256) public claimByPack;

    error Unauthorized();
    error InvalidInput();
    error InsufficientFloat();
    error InvalidState();
    error TransferFailed();

    event InsurerSet(address indexed insurer);
    event PlatformSet(address indexed platform);
    event Deposited(address indexed insurer, uint256 amount);
    event ClaimOpened(uint256 indexed claimId, bytes32 indexed packHash, address indexed payee, uint256 amount, address opener);
    event ClaimPaid(uint256 indexed claimId, address indexed payee, uint256 amount, address indexed insurer);
    event ClaimRejected(uint256 indexed claimId, uint256 amount, address indexed insurer);

    constructor(address tokenAddress) {
        if (tokenAddress.code.length == 0) revert InvalidInput();
        owner = msg.sender;
        token = ClaimToken(tokenAddress);
    }

    function setInsurer(address account) external {
        if (msg.sender != owner) revert Unauthorized();
        if (account == address(0)) revert InvalidInput();
        insurer = account;
        emit InsurerSet(account);
    }

    function setPlatform(address account) external {
        if (msg.sender != owner) revert Unauthorized();
        if (account == address(0)) revert InvalidInput();
        platform = account;
        emit PlatformSet(account);
    }

    function deposit(uint256 amount) external {
        if (msg.sender != insurer) revert Unauthorized();
        if (amount == 0) revert InvalidInput();
        uint256 beforeBalance = token.balanceOf(address(this));
        if (!token.transferFrom(msg.sender, address(this), amount)) revert TransferFailed();
        if (token.balanceOf(address(this)) != beforeBalance + amount) revert TransferFailed();
        availableFloat += amount;
        emit Deposited(msg.sender, amount);
    }

    function openClaim(bytes32 packHash, address payee, uint256 amount) external returns (uint256 id) {
        if (msg.sender != owner && msg.sender != platform) revert Unauthorized();
        if (packHash == bytes32(0) || payee == address(0) || payee == address(this) || amount == 0) revert InvalidInput();
        if (claimByPack[packHash] != 0) revert InvalidState();
        if (amount > availableFloat) revert InsufficientFloat();
        availableFloat -= amount;
        reservedFloat += amount;
        id = ++claimCount;
        claims[id] = Claim(packHash, payee, amount, State.Opened);
        claimByPack[packHash] = id;
        emit ClaimOpened(id, packHash, payee, amount, msg.sender);
    }

    function approveAndRelease(uint256 claimId) external {
        if (msg.sender != insurer) revert Unauthorized();
        Claim storage claim = claims[claimId];
        if (claim.state != State.Opened) revert InvalidState();
        claim.state = State.Paid;
        reservedFloat -= claim.amount;
        if (!token.transfer(claim.payee, claim.amount)) revert TransferFailed();
        emit ClaimPaid(claimId, claim.payee, claim.amount, msg.sender);
    }

    function reject(uint256 claimId) external {
        if (msg.sender != insurer) revert Unauthorized();
        Claim storage claim = claims[claimId];
        if (claim.state != State.Opened) revert InvalidState();
        claim.state = State.Rejected;
        reservedFloat -= claim.amount;
        availableFloat += claim.amount;
        emit ClaimRejected(claimId, claim.amount, msg.sender);
    }
}
