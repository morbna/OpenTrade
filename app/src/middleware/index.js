import { toast } from 'react-toastify';
import { generateStore, EventActions } from '@drizzle/store';
import drizzleOptions from '../drizzleOptions';

const contractEventNotifier = (store) => (next) => (action) => {
	const events = {
		NewListing: 'Listing Posted',
		DeleteListing: 'Listing Deleted',
		TradeInit: 'Purchased',
		TradeComplete: 'Trade Completed',
		TradeCancel: 'Trade Cancelled',
		Bought: 'Tokens Bought',
	};

	if (action.type === EventActions.EVENT_FIRED) {
		const contractEvent = action.event.event;
		const display = events[contractEvent];
		toast.success(display, { position: toast.POSITION.TOP_RIGHT });
	}
	return next(action);
};

const appMiddlewares = [contractEventNotifier];

const store = generateStore({
	drizzleOptions,
	appMiddlewares,
	disableReduxDevTools: false, // enable ReduxDevTools!
});

export default store;
