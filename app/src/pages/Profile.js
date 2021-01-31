import React, { useState } from 'react';
import { newContextComponents } from '@drizzle/react-components';
import 'react-toastify/dist/ReactToastify.css';
import { Row, Table } from 'react-bootstrap';
import ContractActionButton from '../middleware/ContractActionButton';

const { ContractData, ContractForm } = newContextComponents;

export default ({ drizzle, drizzleState, Listings }) => {
	const [amount, setAmount] = useState(0);
	const status = ['New', 'Pending', 'Completed', 'Deleted'];
	const TradeSatus = { NEW: 0, PENDING: 1, COMPLETED: 2, DELETED: 3 };

	return (
		<div className='App'>
			<div className='section'>
				<h3>Buy Tokens </h3>
				<Row className='row-in'>
					<input
						name={'Tokens'}
						type='number'
						placeholder={'Enter TDC amount'}
						onChange={(e) =>
							setAmount(e.target.value ? e.target.value : 0)
						}
					/>
					<ContractForm
						drizzle={drizzle}
						contract='TradeCoin'
						method='buy'
						sendArgs={{
							from: drizzleState.accounts[0],
							value: drizzle.web3.utils.toWei(
								String(amount / 1000),
								'ether'
							),
						}}
					/>
					&nbsp;&nbsp;&nbsp; 1 ETH = 1,000&nbsp;
					<ContractData
						drizzle={drizzle}
						drizzleState={drizzleState}
						contract='TradeCoin'
						method='symbol'
						hideIndicator
					/>
				</Row>
				<br />
				<strong>My Balance: </strong>
				<ContractData
					drizzle={drizzle}
					drizzleState={drizzleState}
					contract='TradeCoin'
					method='balanceOf'
					methodArgs={[drizzleState.accounts[0]]}
				/>{' '}
				<ContractData
					drizzle={drizzle}
					drizzleState={drizzleState}
					contract='TradeCoin'
					method='symbol'
					hideIndicator
				/>
				<br />
				<strong>Escrowed Funds: </strong>
				<ContractData
					drizzle={drizzle}
					drizzleState={drizzleState}
					contract='TradeCoin'
					method='escrowed'
					methodArgs={[drizzleState.accounts[0]]}
				/>{' '}
				<ContractData
					drizzle={drizzle}
					drizzleState={drizzleState}
					contract='TradeCoin'
					method='symbol'
					hideIndicator
				/>{' '}
			</div>
			<div className='section'>
				<h3>My Listings </h3>
				<Table striped bordered hover>
					<thead>
						<tr>
							<th>Listing id</th>
							<th>Product Price</th>
							<th>Product Name</th>
							<th>Product Description</th>
							<th>Status</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{Listings &&
							Listings.filter((listing) => {
								return (
									listing.seller === drizzleState.accounts[0]
								);
							}).map((listing, index) => {
								return (
									<tr key={index}>
										<td>{listing.id}</td>
										<td>{listing.price}</td>
										<td>{listing.name}</td>
										<td>{listing.desc}</td>
										<td>{status[listing.status]}</td>
										<td>
											{listing.status ===
												TradeSatus.NEW && (
												<ContractActionButton
													drizzle={drizzle}
													drizzleState={drizzleState}
													contract='OpenTrade'
													method='deleteListing'
													inputs={[listing.id]}
													sendArgs={{
														from:
															drizzleState
																.accounts[0],
													}}
													buttonName='Delete'
													buttonVariant='danger'
												/>
											)}
											{listing.status ===
												TradeSatus.PENDING && (
												<ContractActionButton
													drizzle={drizzle}
													drizzleState={drizzleState}
													contract='OpenTrade'
													method='cancelTrade'
													inputs={[listing.id]}
													sendArgs={{
														from:
															drizzleState
																.accounts[0],
													}}
													buttonName='Cancel'
													buttonVariant='warning'
												/>
											)}
										</td>
									</tr>
								);
							})}
					</tbody>
				</Table>
			</div>
			<div className='section'>
				<h3>Pending Purchases</h3>
				<Table striped bordered hover>
					<thead>
						<tr>
							<th>Listing id</th>
							<th>Product Price</th>
							<th>Product Name</th>
							<th>Product Description</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{Listings &&
							Listings.filter((listing) => {
								return (
									listing.buyer ===
										drizzleState.accounts[0] &&
									listing.status === TradeSatus.PENDING
								);
							}).map((listing, index) => {
								return (
									<tr key={index}>
										<td>{listing.id}</td>
										<td>{listing.price}</td>
										<td>{listing.name}</td>
										<td>{listing.desc}</td>
										{listing.status ===
											TradeSatus.PENDING && (
											<td>
												<div className='profileButton'>
													<ContractActionButton
														drizzle={drizzle}
														drizzleState={
															drizzleState
														}
														contract='OpenTrade'
														method='completeTrade'
														inputs={[listing.id]}
														sendArgs={{
															from:
																drizzleState
																	.accounts[0],
														}}
														buttonName='Complete'
														buttonVariant='info'
													/>
													&nbsp;
													<ContractActionButton
														drizzle={drizzle}
														drizzleState={
															drizzleState
														}
														contract='OpenTrade'
														method='cancelTrade'
														inputs={[listing.id]}
														sendArgs={{
															from:
																drizzleState
																	.accounts[0],
														}}
														buttonName='Cancel'
														buttonVariant='warning'
													/>
												</div>
											</td>
										)}
									</tr>
								);
							})}
					</tbody>
				</Table>
			</div>
			<div className='section'>
				<h3>Completed Purchases</h3>
				<Table striped bordered hover>
					<thead>
						<tr>
							<th>Listing id</th>
							<th>Product Price</th>
							<th>Product Name</th>
							<th>Product Description</th>
						</tr>
					</thead>
					<tbody>
						{Listings &&
							Listings.filter((listing) => {
								return (
									listing.buyer ===
										drizzleState.accounts[0] &&
									listing.status === TradeSatus.COMPLETED
								);
							}).map((listing, index) => {
								return (
									<tr key={index}>
										<td>{listing.id}</td>
										<td>{listing.price}</td>
										<td>{listing.name}</td>
										<td>{listing.desc}</td>
									</tr>
								);
							})}
					</tbody>
				</Table>
			</div>
		</div>
	);
};
