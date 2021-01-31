// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";

import "@openzeppelin/contracts/math/SafeMath.sol";

contract TradeCoin is ERC20, Ownable {
    using SafeMath for uint256;

    string public constant name = "TradeCoin";
    string public constant symbol = "TDC";
    uint256 public constant decimals = 0;
    uint256 public constant INITIAL_SUPPLY =  1000000000; // 1B TDC
    uint256 public constant etherRatio = 1000; // 1 ETH : 1000 TDC

    mapping (address => uint256) private _escrowed;

    constructor() public {
        _mint(address(this), INITIAL_SUPPLY * (10 ** decimals));
    }

    event Bought(uint256 amount);
    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);

    modifier isCaller(address sender) {
        require(sender == msg.sender, "Invalid access");
        _;
    }
    modifier hasFunds(address target, uint256 amount) {
        require(this.balanceOf(target) >= amount, 'Not enough funds');
        _;
    }

    modifier hasEscrowedFunds(address target, uint256 amount) {
        require(_escrowed[target] >= amount, 'Not enough escrowed funds');
        _;
    }

    function escrowed(address target) external view returns(uint256) {
        return _escrowed[target];
    }

    function buy() payable external {
        uint256 amountTobuy = msg.value * etherRatio / (10 ** 18);
        require(amountTobuy > 0, "You need to send some ether");
        require(amountTobuy <= this.balanceOf(address(this)), "Not enough tokens in the reserve");

        this.transfer(msg.sender, amountTobuy);
        emit Bought(amountTobuy);
    }

    function deposit(address sender, uint256 amount) public onlyOwner() hasFunds(sender, amount) {
        _transfer(sender, address(this), amount);
        _escrowed[sender] = _escrowed[sender].add(amount);
        emit Deposit(amount);
    }

    function withdraw(address sender, uint256 amount) public onlyOwner() hasFunds(address(this), amount) hasEscrowedFunds(address(sender), amount) {
        _escrowed[sender] = _escrowed[sender].sub(amount);
        _transfer(address(this), sender, amount);
        emit Withdraw(amount);
    }

    function transferFunds(address from, address to, uint256 amount) public onlyOwner() {
        _transferEscrow(from,to,amount);
        withdraw(to,amount);
    }

    function _transferEscrow(address from, address to, uint256 amount) internal {
        _escrowed[from] = _escrowed[from].sub(amount);
        _escrowed[to] = _escrowed[to].add(amount);
    }

}
