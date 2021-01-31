import React, { useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import getTxStatus from './getTxStatus';

export default ({
	drizzle,
	drizzleState,
	contract,
	method,
	inputs,
	sendArgs,
	disablePredicate,
	disableAction = false,
	buttonName,
	buttonVariant,
	butonType,
	history,
	nav,
}) => {
	const [stackID, setStackID] = useState(null);

	const handleSubmit = (event) => {
		event.preventDefault();
		var stackId;
		if (sendArgs) {
			stackId = drizzle.contracts[contract].methods[method].cacheSend(
				...inputs,
				sendArgs
			);
		} else
			stackId = drizzle.contracts[contract].methods[method].cacheSend(
				...inputs
			);
		setStackID(stackId);
	};

	return getTxStatus(drizzleState, stackID, history, nav) === 'pending' ? (
		<>
			<Button variant={buttonVariant} disabled>
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
		<Button
			type={butonType}
			disabled={disablePredicate}
			variant={buttonVariant}
			onClick={!disableAction && handleSubmit}
		>
			{buttonName}
		</Button>
	);
};
