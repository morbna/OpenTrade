import './App.css';
import React, { useState } from 'react';
import { DrizzleContext } from '@drizzle/react-plugin';
import MyContainer from './MyContainer';

export default () => {
	const [Listings, setListings] = useState(null);
	const [keyword, setKeyword] = useState(null);

	return (
		<DrizzleContext.Consumer>
			{(drizzleContext) => {
				const { drizzle, drizzleState, initialized } = drizzleContext;
				if (!initialized) {
					return 'Loading...';
				}

				return (
					<MyContainer
						drizzle={drizzle}
						drizzleState={drizzleState}
						Listings={Listings}
						setListings={setListings}
						keyword={keyword}
						setKeyword={setKeyword}
					/>
				);
			}}
		</DrizzleContext.Consumer>
	);
};
