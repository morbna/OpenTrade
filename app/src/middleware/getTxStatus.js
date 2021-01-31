export default (drizzleState, stackId, history, nav) => {
	const { transactions, transactionStack } = drizzleState;
	const txHash = transactionStack[stackId];

	if (!txHash) return null;

	if (transactions[txHash]) {
		if (transactions[txHash].status === 'success' && history && nav) {
			history.push(nav);
		}

		return transactions[txHash].status;
	}
};
