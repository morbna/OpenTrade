import React from 'react';
import { Nav, Navbar, Form, FormControl } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export default ({ setKeyword }) => {
	const onInput = ({ target: { value } }) => setKeyword(value);

	return (
		<Navbar bg='dark' variant='dark'>
			<Navbar.Brand>OpenTrade</Navbar.Brand>
			<Nav className='mr-auto'>
				<LinkContainer exact to='/'>
					<Nav.Link>Home</Nav.Link>
				</LinkContainer>
				<LinkContainer to='/new_listing'>
					<Nav.Link>Sell</Nav.Link>
				</LinkContainer>
				<LinkContainer to='/profile'>
					<Nav.Link>Profile</Nav.Link>
				</LinkContainer>
			</Nav>
			<Form inline>
				<FormControl
					type='text'
					placeholder='Search Products'
					className='mr-sm-2'
					onChange={onInput}
				/>
			</Form>
		</Navbar>
	);
};
