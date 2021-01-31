import TradeCoin from './contracts/TradeCoin.json';
import OpenTrade from './contracts/OpenTrade.json';

const options = {
	contracts: [TradeCoin, OpenTrade],
	events: {
		OpenTrade: [
			'NewListing',
			'DeleteListing',
			'TradeInit',
			'TradeComplete',
			'TradeCancel',
		],
		TradeCoin: ['Bought', 'Deposit', 'Withdraw'],
	},
	polls: {
		accounts: 1000,
	},
};

export default options;
