import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { FundingContract, FundingContractEthers } from '../components/ethereum_connectors/FundingContract.js';
import { Card, Table, Button, Form, InputGroup, Modal } from 'react-bootstrap';
import web3 from '../components/ethereum_connectors/web3';
import Web3 from 'web3';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';


function FundingPage() {
    const [cookies, setCookie] = useCookies();
    const [fundingcontract, setfundingcontract] = useState(FundingContract(cookies.EventAddress));
    const [fundingcontract1, setfundingcontract1] = useState(FundingContractEthers(cookies.EventAddress));
    const [fundDetails, setFundDetails] = useState({});
    const [votingEventDetails, setVotingEventDetails] = useState([]);

    const [viewContributeButton, setViewContributeButton] = useState(false);
    const [viewContributorsTable, setViewContributorsTable] = useState(false);
    const [viewVotingEventsTable, setViewVotingEventsTable] = useState(false);
    const [viewCreateVotingEventForm, setViewCreateVotingEventForm] = useState(false);

    const [popup, setPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [contributeButtonStatus, setContributeButtonStatus] = useState(false);
    const [createVotingEventButtonStatus, setCreateVotingEventButtonStatus] = useState(false);

    const [depositAmount, setDepositAmount] = useState("");
    const [createVotingEventDetails, setCreateVotingEventDetails] = useState({
        title: "",
        description: "",
        destination_address: "",
        deposit_amount: ""
    });

    //this is used for loading state components on page load
    useEffect(() => {
        (async () => {
            await LoadFundDetails();
        })();
    }, []);

    var LoadFundDetails = async () => {
        setFundDetails(await fundingcontract.methods.GetCrowdfundingEventDetails().call());
        setVotingEventDetails(await fundingcontract.methods.GetVotingEvents().call());
    }

    var LoadVotingEventDetails = async (event) => {
        let temp = {
            title: createVotingEventDetails.title,
            description: createVotingEventDetails.description,
            destination_address: createVotingEventDetails.destination_address,
            deposit_amount: createVotingEventDetails.deposit_amount
        };
        if (event.type === "change") {
            if (event.currentTarget.id === "1")
                temp.title = event.target.value;
            if (event.currentTarget.id === "2")
                temp.description = event.target.value;
            if (event.currentTarget.id === "3")
                temp.destination_address = event.target.value;
            if (event.currentTarget.id === "4")
                temp.deposit_amount = event.target.value;
        }
        setCreateVotingEventDetails(temp);
    }

    var ContributeFunds = async () => {
        setCreateVotingEventButtonStatus(true);
        try {
            setMessage("Voting event creation in progress .... !!!!");
            setPopup(true);
            const temp = await fundingcontract.methods
                .DepositToCrowdfundingEvent()
                .send({
                    from: cookies.MetamaskLoggedInAddress, value: Web3.utils.toWei(depositAmount, 'ether')
                });
            setMessage("Voting event creation success...... !!!!" + "block hash : " + temp.blockHash);
        }
        catch (error) {
            error.reason != undefined ? setMessage("Error : " + error.reason) : setMessage("Error : " + error.message);
        }
        setCreateVotingEventButtonStatus(false);
        await LoadFundDetails();
    }

    var CreateVotingEvent = async () => {
        setContributeButtonStatus(true);
        try {
            setMessage("User contribution in progress .... !!!!");
            setPopup(true);
            // const temp = await fundingcontract.methods
            //     .CreateAnVotingEvent(createVotingEventDetails.title, createVotingEventDetails.description, createVotingEventDetails.destination_address, Web3.utils.toWei(createVotingEventDetails.deposit_amount, 'ether'))
            //     .send({
            //         from: cookies.MetamaskLoggedInAddress
            //     });
            const temp = await fundingcontract1.CreateAnVotingEvent(createVotingEventDetails.title, createVotingEventDetails.description, createVotingEventDetails.destination_address, Web3.utils.toWei(createVotingEventDetails.deposit_amount, 'ether'));
            setMessage("User contribution success...... !!!!" + "block hash : " + temp.blockHash);
        }
        catch (error) {
            error.reason != undefined ? setMessage("Error : " + error.reason) : setMessage("Error : " + error.message);
        }
        setContributeButtonStatus(false);
        await LoadFundDetails();
    }

    var LoadVotingPage = async (event) => {
        setCookie('VotingIndex', event, { path: '/' });
        window.location.href = "/vote";
    }

    return (
        <>
            <div style={{ width: "60%", margin: "0 auto" }}>
                <h1 className="text-center" >{fundDetails[0]}</h1>
                <h3 className="text-center" >{fundDetails[1]}</h3>
                <h5> Fund Details: (Fund Address : {cookies.EventAddress})</h5>
                <Card>
                    <Card.Header as="h4">Fund Manager Details</Card.Header>
                    <Card.Body>
                        <Card.Title>{fundDetails[2]}</Card.Title>
                        <Card.Text>
                            This is the wallet address of the fund manager who created this funding event.
                        </Card.Text>
                    </Card.Body>
                </Card>
                <br />
                <div className='d-flex'>
                    <Card className='m-1'>
                        <Card.Header as="h4">Fund Minimum Contribution</Card.Header>
                        <Card.Body>
                            <Card.Title>{Web3.utils.fromWei(fundDetails[3] == undefined ? '0' : fundDetails[3].toString(), 'ether') + " eth"}</Card.Title>
                            <Card.Text>
                                Deposits should be made equal to or in multiples of the minimum set for this fund.
                                <br /><br />
                                <Button variant="primary" type="submit" onClick={() => { setViewContributeButton(!viewContributeButton) }}>
                                    {!viewContributeButton ? 'Contribute' : 'Hide Contribution Form'}</Button>
                                <br /><br />
                                {viewContributeButton ? <>
                                    <InputGroup className="mb-3">
                                        <Button variant="primary" type="submit" disabled={contributeButtonStatus} onClick={ContributeFunds}>Contribute</Button>
                                        <Form.Control
                                            placeholder="Enter Contribution in ether"
                                            aria-describedby="basic-addon2"
                                            onChange={(event) => setDepositAmount(event.target.value)}
                                            type="number"
                                        />
                                        <InputGroup.Text>ether</InputGroup.Text>
                                    </InputGroup>
                                </> : <></>}
                            </Card.Text>
                        </Card.Body>
                    </Card >
                    <Card className='m-1'>
                        <Card.Header as="h4">Fund Wallet Balance</Card.Header>
                        <Card.Body>
                            <Card.Title>{Web3.utils.fromWei(fundDetails[6] == undefined ? '0' : fundDetails[6].toString(), 'ether') + " eth"}</Card.Title>
                            <Card.Text>
                                This is the balance left for the fund manager to spend from the funds ethereum account.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </div>
                <br />
                <div className='d-flex'>
                    <Card className='m-1' style={{ width: '50%' }}>
                        <Card.Header as="h4">Contributors Info</Card.Header>
                        <Card.Body>
                            <Card.Title>{fundDetails[4]?.length + ' contributors have ' + fundDetails[5] + ' votes.'}</Card.Title>
                            <Card.Text>
                                Total Number of Contributors and Votes.
                                <br /><br />
                                <Button 
                                    variant="primary" 
                                    type="submit" 
                                    onClick={() => { 
                                        setViewContributorsTable(!viewContributorsTable)
                                        setViewVotingEventsTable(false)
                                        }}>
                                    {!viewContributorsTable ? 'View' : 'Hide'} Contributors</Button>
                                <br /><br />
                            </Card.Text>
                        </Card.Body>
                    </Card>
                    <Card className='m-1' style={{ width: '50%' }}>
                        <Card.Header as="h4">Voting Events</Card.Header>
                        <Card.Body>
                            <Card.Title>{fundDetails[7]}</Card.Title>
                            <Card.Text>
                                Voting events present in this fund.
                                <br /><br />
                                <Button
                                    variant="primary"
                                    type="submit"
                                    onClick={() => { 
                                        setViewCreateVotingEventForm(!viewCreateVotingEventForm) 
                                        }}>
                                    {!viewCreateVotingEventForm ? 'Create Voting Event' : 'Hide Create Voting Event Form'}</Button>
                                <br /><br />
                                {viewCreateVotingEventForm ? <>
                                    <InputGroup className="mb-3">
                                        <InputGroup.Text>Voting Event Title</InputGroup.Text>
                                        <Form.Control
                                            id='1'
                                            placeholder="Enter Title"
                                            aria-describedby="basic-addon2"
                                            onChange={LoadVotingEventDetails}
                                        />
                                    </InputGroup>
                                    <InputGroup className="mb-3">
                                        <InputGroup.Text>Voting Event Description</InputGroup.Text>
                                        <Form.Control
                                            id='2'
                                            placeholder="Enter Descrption"
                                            aria-describedby="basic-addon2"
                                            onChange={LoadVotingEventDetails}
                                        />
                                    </InputGroup>
                                    <InputGroup className="mb-3">
                                        <InputGroup.Text>Destination Wallet Address</InputGroup.Text>
                                        <Form.Control
                                            id='3'
                                            placeholder="Enter Wallet Address"
                                            aria-describedby="basic-addon2"
                                            onChange={LoadVotingEventDetails}
                                        />
                                    </InputGroup>
                                    <InputGroup className="mb-3">
                                        <InputGroup.Text>ether</InputGroup.Text>
                                        <Form.Control
                                            id='4'
                                            placeholder="Enter how much ether you want to send"
                                            aria-describedby="basic-addon2"
                                            onChange={LoadVotingEventDetails}
                                            type="number"
                                        />
                                    </InputGroup>
                                    <Button variant="primary" type="submit" disabled={createVotingEventButtonStatus} onClick={CreateVotingEvent}>Create Voting Event</Button>
                                    <br /><br />
                                </> : <></>}

                                <Button 
                                    variant="primary" 
                                    type="submit" 
                                    onClick={() => { 
                                        setViewVotingEventsTable(!viewVotingEventsTable)
                                        setViewContributorsTable(false)
                                    }}>
                                    {!viewVotingEventsTable ? 'View' : 'Hide'} Voting Events</Button>
                                <br /><br />
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </div>
                <div>
                    {viewContributorsTable ?
                        <Table striped bordered hover variant="dark">
                            <thead>
                                <tr>
                                    <th>Contributor</th>
                                    <th>Deposit</th>
                                    <th>No of Votes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fundDetails[4]?.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{item.contributor_address}</td>
                                            <td>{Web3.utils.fromWei((item.contributor_votes * fundDetails[3]).toString(), 'ether') + " eth"}</td>
                                            <td>{item.contributor_votes}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table> : <></>}
                </div>
                <div>
                    {viewVotingEventsTable ?
                        <Table striped bordered hover variant="light">
                            <thead>
                                <tr>
                                    <th>Voting Event Title</th>
                                    <th>Destination Wallet</th>
                                    <th>Transfer Amount</th>
                                    <th>Voting Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {votingEventDetails?.map((item, index) => {
                                    return (
                                        <tr key={index}
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => LoadVotingPage(index)}>
                                            <td>{item.title}</td>
                                            <td>{item.destination_wallet_address}</td>
                                            <td>{Web3.utils.fromWei((item.amount_to_send).toString(), 'ether') + ' eth'}</td>
                                            <td style={{ color: !item.event_completion_status ? 'blue' : item.event_success_status ? 'green' : 'red' }}>
                                                {
                                                    !item.event_completion_status ? 'In Progress' : item.event_success_status ? 'Successcul' : "Failed"
                                                }
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table> : <></>}
                </div>
                <Modal
                    show={popup}
                    onHide={async () => {
                        setPopup(false);
                    }}
                    size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>AJ Crowdfunding Platform Message Popup</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            <b style={{ color: message.includes('progress') ? 'blue' : message.includes('Error') ? 'red' : 'green' }}>
                                {message}</b>
                        </div>
                        {
                            message.includes('progress') ?
                                <div style={{ float: "right" }}>
                                    <CountdownCircleTimer
                                        isPlaying
                                        duration={30}
                                        colors={['#004777', '#F7B801', '#A30000', '#A30000']}
                                        colorsTime={[20, 15, 10, 5]}
                                        size="90">
                                        {({ remainingTime }) => remainingTime}
                                    </CountdownCircleTimer>
                                </div>
                                : <></>}
                    </Modal.Body>
                </Modal>

            </div>
        </>
    )
}

export default FundingPage