import React, { useState } from 'react';
import { Card, Button, Form, InputGroup } from 'react-bootstrap';
import Web3 from 'web3';

function ContributeComponent({fundDetails, contributeButtonStatus, ContributeFunds, setDepositAmount}) {
    
    const [viewContributeButton, setViewContributeButton] = useState(false);

    return (
        <Card className='m-1'>
            <Card.Header as="h4">Minimum Contribution</Card.Header>
            <Card.Body>
                <Card.Title>{Web3.utils.fromWei(fundDetails[3] === undefined ? '0' : fundDetails[3].toString(), 'ether') + " Eth"}</Card.Title>
                <Card.Text>
                    Deposits should be made equal to or in multiples of the minimum amount set for this fund.
                    <br /><br />
                    <Button variant="primary" type="submit" onClick={() => { setViewContributeButton(!viewContributeButton) }}>
                        {!viewContributeButton ? 'Contribute' : 'Hide Contribution Form'}</Button>
                    <br /><br />
                    {viewContributeButton ? <>
                        <InputGroup className="mb-3">
                            <Button variant="primary" type="submit" disabled={contributeButtonStatus} onClick={ContributeFunds}>Contribute</Button>
                            <Form.Control
                                placeholder="Enter Contribution in Ether"
                                aria-describedby="basic-addon2"
                                onChange={(event) => setDepositAmount(event.target.value)}
                                type="number"
                            />
                            <InputGroup.Text>Eth</InputGroup.Text>
                        </InputGroup>
                    </> : <></>}
                </Card.Text>
            </Card.Body>
        </Card >
    )
}

export default ContributeComponent