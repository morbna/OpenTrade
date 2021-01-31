const TradeCoin = artifacts.require('TradeCoin');
const OpenTrade = artifacts.require('OpenTrade');

module.exports = async function (deployer) {
	await deployer.deploy(TradeCoin);
	const token = await TradeCoin.deployed();
	await deployer.deploy(OpenTrade, token.address);
	const contract = await OpenTrade.deployed();
	await token.methods['transferOwnership(address)'](contract.address);
};
