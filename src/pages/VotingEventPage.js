import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { FundingContract } from '../components/ethereum_connectors/FundingContract.js';
import { Card, ListGroup, Button, Table, Modal } from 'react-bootstrap';
import web3 from '../components/ethereum_connectors/web3.js';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

function VotingEventPage() {

    const [cookies, setCookie] = useCookies();
    const [fundingcontract, setfundingcontract] = useState(FundingContract(cookies.EventAddress));

    const [fundDetails, setFundDetails] = useState({});
    const [votingEventDetails, setVotingEventDetails] = useState({});
    const [voteDivision, setVoteDivision] = useState({});

    const [viewContributorsVotingTable, setViewContributorsVotingTable] = useState(false);
    const [contributorsVotingTable, setContributorsVotingTable] = useState([]);

    const [votingButton, setVotingButton] = useState(true);
    const [pollingButton, setPollingButton] = useState(false);

    const [popup, setPopup] = useState(false);
    const [message, setMessage] = useState("");

    //this is used for loading state components on page load
    useEffect(() => {
        (async () => {
            await LoadVotingDetails();
        })();
    }, []);

    var LoadVotingDetails = async () => {
        const temp = await fundingcontract.methods.GetCrowdfundingEventDetails().call();
        setFundDetails(temp);
        const temp1 = await fundingcontract.methods.GetVotingEvents().call();
        setVotingEventDetails(temp1[cookies.VotingIndex]);
        var tempTable = [];
        var tempVoteDivision = { approved: 0, refused: 0, yettovote: 0, total: 0 };
        temp[4].forEach((element, index) => {
            temp1[cookies.VotingIndex].polling_data.forEach((element2) => {
                if (element.contributor_address == element2.contributor_address) {
                    tempTable.push({
                        contributor_address: element.contributor_address,
                        contributor_vote_status: element2.contributor_vote_status,
                        contributor_votes: element.contributor_votes
                    });
                    element2.contributor_vote_status ?
                        tempVoteDivision.approved = tempVoteDivision.approved + parseInt(element.contributor_votes) :
                        tempVoteDivision.refused = tempVoteDivision.refused + parseInt(element.contributor_votes);
                }
            })
            if (tempTable[index] == undefined) {
                tempTable.push({
                    contributor_address: element.contributor_address,
                    contributor_votes: element.contributor_votes
                });
                tempVoteDivision.yettovote = tempVoteDivision.yettovote + parseInt(element.contributor_votes);
                if(cookies.MetamaskLoggedInAddress == element.contributor_address)
                setVotingButton(false);
            }
            tempVoteDivision.total = tempVoteDivision.total + parseInt(element.contributor_votes);
        });
        setVoteDivision(tempVoteDivision);
        setContributorsVotingTable(tempTable);

    }

    var Vote = async (vote) => {
        setVotingButton(true);
        try {
            setMessage("Voting in progress .... !!!!");
            setPopup(true);
            const temp = await fundingcontract.methods
                .VoteForVotingEvent(cookies.VotingIndex,vote)
                .send({
                    from: cookies.MetamaskLoggedInAddress
                });
            setMessage("Voted successfully...... !!!!" + "block hash : " + temp.blockHash);
        }
        catch (error) {
            error.reason != undefined ? setMessage("Error : " + error.reason) : setMessage("Error : " + error.message);
        }
        setVotingButton(false);
        await LoadVotingDetails();
    }

    var ClosePolling = async () => {
        setPollingButton(true);
        try {
            setMessage("Close polling in progress .... !!!!");
            setPopup(true);
            const temp = await fundingcontract.methods
                .CompleteVotingEvent(cookies.VotingIndex)
                .send({
                    from: cookies.MetamaskLoggedInAddress
                });
            setMessage("Polling closed successfully...... !!!!" + "block hash : " + temp.blockHash);
        }
        catch (error) {
            error.reason != undefined ? setMessage("Error : " + error.reason) : setMessage("Error : " + error.message);
        }
        setPollingButton(false);
        await LoadVotingDetails();
    }


    return (
        <>
            <div style={{ width: "60%", margin: "0 auto" }}>
                <h1 className="text-center" >{votingEventDetails?.title}</h1>
                <h3 className="text-center" >{votingEventDetails?.body}</h3>
                <Card>
                    <Card.Header><b>Fund Details</b></Card.Header>
                    <ListGroup variant="flush">
                        <ListGroup.Item><b>Fund Address</b>: {cookies.EventAddress}</ListGroup.Item>
                        <ListGroup.Item><b>Manager Address</b>: {fundDetails[2]}</ListGroup.Item>
                        <ListGroup.Item><b>Fund Balance</b>: {web3.utils.fromWei(fundDetails[6] == undefined ? '0' : fundDetails[6].toString(), 'ether') + " eth"}</ListGroup.Item>
                        <ListGroup.Item><b>Contributors Info</b>: {fundDetails[4]?.length + ' contributors have ' + fundDetails[5] + ' votes.'}</ListGroup.Item>
                    </ListGroup>
                </Card>
                <br />
                <Card>
                    <Card.Header>
                        <b>Voting Details</b>
                        <Button 
                            variant="primary" 
                            type="submit" 
                            disabled={pollingButton} 
                            onClick={ClosePolling}
                            style={{float: 'right'}}
                            >
                                Close Polling
                        </Button>
                    </Card.Header>
                    <ListGroup variant="flush">
                        <ListGroup.Item><b>Destination Wallet Address</b>: {votingEventDetails.destination_wallet_address}</ListGroup.Item>
                        <ListGroup.Item><b>Amount Being Sent</b>: {web3.utils.fromWei(votingEventDetails.amount_to_send == undefined ? '0' : votingEventDetails.amount_to_send.toString(), 'ether') + " eth"}</ListGroup.Item>
                        <ListGroup.Item><b>Voting Event Status</b>:&nbsp;
                            <ins style={{ color: !votingEventDetails.event_completion_status ? 'blue' : votingEventDetails.event_success_status ? 'green' : 'red' }}>
                                {!votingEventDetails.event_completion_status ? 'In Progress' : votingEventDetails.event_success_status ? 'Successcul' : "Failed"}
                            </ins>
                            </ListGroup.Item>
                            <ListGroup.Item>
                            <p>
                                <b>Vote Alignment: </b>
                                Approved: <b style={{ color: 'green' }}>{voteDivision.approved}</b>, 
                                Refused: <b style={{ color: 'red' }}>{voteDivision.refused}</b>, 
                                Yet to Vote: <b style={{ color: 'blue' }}>{voteDivision.yettovote}</b>, 
                                Total: <b>{voteDivision.total}</b>
                            </p>
                            <Button variant="primary" type="submit" onClick={() => { setViewContributorsVotingTable(!viewContributorsVotingTable) }}>
                                {!viewContributorsVotingTable ? 'View' : 'Hide'} Contributors Voting Table      
                            </Button>&nbsp;
                            <span style={{float: 'right'}}>
                            (These buttons are only enabled for contributors who have not voted --{'>'})
                            <Button variant="success" type="submit" disabled={votingButton} onClick={()=>{Vote(1)}}>Approve</Button>&nbsp;
                            <Button variant="danger" type="submit" disabled={votingButton} onClick={()=>{Vote(0)}}>Refuse</Button>
                            </span>
                            <br /><br />
                            {viewContributorsVotingTable ?
                                <Table striped bordered hover variant="dark">
                                    <thead>
                                        <tr>
                                            <th>Contributor</th>
                                            <th>Deposit</th>
                                            <th>No of Votes</th>
                                            <th>Vote Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {contributorsVotingTable?.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{item.contributor_address}</td>
                                                    <td>{web3.utils.fromWei((item.contributor_votes * fundDetails[3]).toString(), 'ether') + " eth"}</td>
                                                    <td>{item.contributor_votes}</td>
                                                    <td style={{ color: item.contributor_vote_status == undefined ? 'white' : item.contributor_vote_status ? 'green' : 'red' }}>
                                                        {item.contributor_vote_status == undefined ? "Yet to Vote" : item.contributor_vote_status ? "Approved" : "Refused"}
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </Table> : <></>}
                        </ListGroup.Item>
                    </ListGroup>
                </Card>
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
        </>
    )
}

export default VotingEventPage