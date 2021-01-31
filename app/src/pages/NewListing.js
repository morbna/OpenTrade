import React, { useState, useEffect } from 'react';
import { Spinner, Container, Button, Form } from 'react-bootstrap';
import getTxStatus from '../middleware/getTxStatus';
import { useHistory } from 'react-router-dom';

export default ({ drizzle, drizzleState }) => {
	const [productPrice, setPrudctPrice] = useState(null);
	const [productName, setProductName] = useState(null);
	const [productDesc, setProductDesc] = useState(null);
	const [productPicture, setProductPicture] = useState(null);
	const [stackID, setStackID] = useState(null);
	const [submitButton, setSubmitButton] = useState(null);
	const history = useHistory();

	useEffect(() => {
		const button =
			getTxStatus(drizzleState, stackID, history, '/') === 'pending' ? (
				<>
					<Button variant='primary' disabled>
						<Spinner
							as='span'
							animation='border'
							size='sm'
							role='status'
							aria-hidden='true'
						/>
						<span className='sr-only'>Working...</span>
					</Button>
				</>
			) : (
				<Button variant='primary' type='submit'>
					Submit
				</Button>
			);

		setSubmitButton(button);
	}, [drizzleState, stackID, history]);

	const listProduct = (e) => {
		e.preventDefault();

		const contract = drizzle.contracts.OpenTrade;
		const stackId = contract.methods['createListing'].cacheSend(
			productName,
			productDesc,
			productPicture,
			productPrice,
			{
				from: drizzleState.accounts[0],
			}
		);
		setStackID(stackId);
	};

	return (
		<Container>
			<h2>
				<br />
				List Product
				<br />
				<br />
			</h2>

			<div className='newListingForm'>
				<Form onSubmit={listProduct}>
					<Form.Group controlId='newListing.price'>
						<Form.Label>Price</Form.Label>
						<Form.Control
							required
							min='0'
							type='number'
							placeholder='Enter product price'
							onChange={(e) => setPrudctPrice(e.target.value)}
						/>
					</Form.Group>
					<Form.Group controlId='newListing.name'>
						<Form.Label>Name</Form.Label>
						<Form.Control
							required
							type='text'
							placeholder='Enter product name'
							onChange={(e) => setProductName(e.target.value)}
						/>
					</Form.Group>
					<Form.Group controlId='newListing.description'>
						<Form.Label>Description</Form.Label>
						<Form.Control
							required
							type='text'
							as='textarea'
							rows={3}
							placeholder='Enter product description'
							onChange={(e) => setProductDesc(e.target.value)}
						/>
					</Form.Group>
					<Form.Group controlId='newListing.picurl'>
						<Form.Label>Picture URL (externally hosted)</Form.Label>
						<Form.Control
							required
							type='text'
							placeholder='Enter URL'
							onChange={(e) => setProductPicture(e.target.value)}
						/>
					</Form.Group>
					{submitButton}
				</Form>
			</div>
		</Container>
	);
};
