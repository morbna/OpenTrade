import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Header from './pages/Header';
import Home from './pages/Home';
import NewListing from './pages/NewListing';
import Profile from './pages/Profile';

const TradeStatus = { NEW: 0, PENDING: 1, COMPLETED: 2, DELETED: 3 };

export default React.memo(
	({ drizzle, drizzleState, Listings, setListings, keyword, setKeyword }) => {
		useEffect(() => {
			const li = [];
			var contractInstance = new drizzle.web3.eth.Contract(
				drizzle.contracts.OpenTrade.abi,
				drizzle.contracts.OpenTrade.address
			);

			contractInstance.getPastEvents(
				'allEvents',
				{
					fromBlock: 0,
					toBlock: 'latest',
				},
				function (error, events) {
					events.forEach((event) => {
						const values = event.returnValues;
						switch (event.event) {
							case 'NewListing':
								li.push({
									seller: values._from,
									buyer: null,
									id: values.id,
									name: values.productName,
									desc: values.productDescription,
									picUrl: values.productPicture,
									price: values.productPrice,
									status: TradeStatus.NEW,
								});
								break;
							case 'DeleteListing':
								li[values.id].status = TradeStatus.DELETED;
								break;
							case 'TradeInit':
								li[values.id].status = TradeStatus.PENDING;
								li[values.id].buyer = values.buyer;
								break;
							case 'TradeComplete':
								li[values.id].status = TradeStatus.COMPLETED;
								break;
							case 'TradeCancel':
								li[values.id].status = TradeStatus.NEW;
								li[values.id].buyer = null;
								break;
							default:
								break;
						}
					});
				}
			);
			setListings(li);
		}, [drizzle, setListings]);

		useEffect(() => {
			const contractInstance = new drizzle.web3.eth.Contract(
				drizzle.contracts.OpenTrade.abi,
				drizzle.contracts.OpenTrade.address
			);

			contractInstance.events.NewListing().on('data', function (event) {
				if (Listings) {
					const values = event.returnValues;
					let newListings = [...Listings];
					newListings.push({
						seller: values._from,
						buyer: null,
						id: values.id,
						name: values.productName,
						desc: values.productDescription,
						picUrl: values.productPicture,
						price: values.productPrice,
						status: TradeStatus.NEW,
					});
					setListings(newListings);
				}
			});

			contractInstance.events
				.DeleteListing()
				.on('data', function (event) {
					if (Listings) {
						const values = event.returnValues;
						let newListings = [...Listings];
						if (newListings[values.id]) {
							newListings[values.id].status = TradeStatus.DELETED;
							setListings(newListings);
						}
					}
				});

			contractInstance.events.TradeInit().on('data', function (event) {
				if (Listings) {
					const values = event.returnValues;
					let newListings = [...Listings];
					if (newListings[values.id]) {
						newListings[values.id].status = TradeStatus.PENDING;
						newListings[values.id].buyer = values.buyer;
						setListings(newListings);
					}
				}
			});

			contractInstance.events
				.TradeComplete()
				.on('data', function (event) {
					if (Listings) {
						const values = event.returnValues;
						let newListings = [...Listings];
						if (newListings[values.id]) {
							newListings[values.id].status =
								TradeStatus.COMPLETED;
							setListings(newListings);
						}
					}
				});

			contractInstance.events.TradeCancel().on('data', function (event) {
				if (Listings) {
					const values = event.returnValues;
					let newListings = [...Listings];
					if (newListings[values.id]) {
						newListings[values.id].status = TradeStatus.NEW;
						newListings[values.id].buyer = null;
						setListings(newListings);
					}
				}
			});
		}, [drizzle, Listings, setListings]);

		return (
			<Router>
				<>
					<Header setKeyword={setKeyword} />
					<Container fluid id='main-content'>
						<Switch>
							<Route
								path='/'
								exact
								render={() => (
									<Home
										drizzle={drizzle}
										drizzleState={drizzleState}
										keyword={keyword}
										Listings={Listings}
									/>
								)}
							/>
							<Route
								path='/new_listing'
								render={() => (
									<NewListing
										drizzle={drizzle}
										drizzleState={drizzleState}
									/>
								)}
							/>
							<Route
								path='/profile'
								render={() => (
									<Profile
										drizzle={drizzle}
										drizzleState={drizzleState}
										Listings={Listings}
									/>
								)}
							/>
						</Switch>
					</Container>
				</>
			</Router>
		);
	},
	(oldProps, newProps) => {
		return oldProps.drizzleState === newProps.drizzleState;
	}
);
