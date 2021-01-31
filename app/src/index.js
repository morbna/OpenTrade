import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import { ToastContainer } from 'react-toastify';

import React from 'react';
import ReactDOM from 'react-dom';
import { generateStore } from '@drizzle/store';

import { Drizzle } from '@drizzle/store';
import { DrizzleContext } from '@drizzle/react-plugin';
import drizzleOptions from './drizzleOptions';
// import store from './middleware';

const store = generateStore({
	drizzleOptions,
});

const drizzle = new Drizzle(drizzleOptions, store);

ReactDOM.render(
	<DrizzleContext.Provider drizzle={drizzle}>
		<ToastContainer />
		<App />
	</DrizzleContext.Provider>,
	document.getElementById('root')
);
