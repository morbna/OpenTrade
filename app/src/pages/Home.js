import React, { useState, useEffect } from 'react';
import { newContextComponents } from '@drizzle/react-components';
import {
	Row,
	Col,
	Button,
	Card,
	CardDeck,
	Container,
	Popover,
	OverlayTrigger,
} from 'react-bootstrap';
import ContractActionButton from '../middleware/ContractActionButton';
const { ContractData } = newContextComponents;

export default ({ drizzle, drizzleState, keyword, Listings }) => {
	const [listing, setListing] = useState(null);
	const [filteredListings, setFilteredListings] = useState(null);

	useEffect(() => {
		if (keyword && Listings) {
			setFilteredListings(
				Listings.filter((listing) => {
					return listing.name
						.toLowerCase()
						.includes(keyword.toLowerCase());
				})
			);
		} else {
			setFilteredListings(Listings);
		}
	}, [Listings, keyword]);

	const popover = (
		<Popover id='popover-basic'>
			<Popover.Title as='h3'>Description</Popover.Title>
			<Popover.Content>{listing ? listing.desc : ''}</Popover.Content>
			<Popover.Title as='h3'>Seller</Popover.Title>
			<Popover.Content>
				{listing ? (
					<ContractData
						drizzle={drizzle}
						drizzleState={drizzleState}
						contract='OpenTrade'
						method='tradeToSeller'
						methodArgs={[listing.id]}
					/>
				) : (
					'nop'
				)}
			</Popover.Content>
		</Popover>
	);

	return (
		<Container fluid id='cards-content'>
			<Row id='cards'>
				<CardDeck>
					{filteredListings &&
						filteredListings
							.filter((listing) => {
								return listing.status === 0;
							})
							.map((listing, index) => {
								return (
									<Col key={index} xs md='auto'>
										<Card style={{ width: '20rem' }}>
											<Card.Img
												variant='top'
												src={listing.picUrl}
											/>
											<Card.Body id={listing.id}>
												<Card.Title>
													{listing.name}
												</Card.Title>
												<Card.Text>
													{listing.price} TDC
												</Card.Text>
												<OverlayTrigger
													trigger='focus'
													placement='bottom'
													overlay={popover}
												>
													<Button
														variant={
															drizzleState
																.accounts[0] ===
															listing.seller
																? 'info'
																: 'primary'
														}
														onFocus={() => {
															setListing(listing);
														}}
													>
														More Info
													</Button>
												</OverlayTrigger>
												&nbsp;
												<ContractActionButton
													drizzle={drizzle}
													drizzleState={drizzleState}
													contract='OpenTrade'
													method='purchaseListing'
													inputs={[listing.id]}
													sendArgs={{
														from:
															drizzleState
																.accounts[0],
													}}
													disablePredicate={
														drizzleState
															.accounts[0] ===
															listing.seller &&
														listing.status === 0
													}
													buttonName='Purchase'
													buttonVariant='success'
												/>
											</Card.Body>
											{drizzleState.accounts[0] ===
												listing.seller && (
												<Card.Footer className='text-muted'>
													This is your listing
												</Card.Footer>
											)}
										</Card>
										<br />
									</Col>
								);
							})}
				</CardDeck>
			</Row>
		</Container>
	);
};
