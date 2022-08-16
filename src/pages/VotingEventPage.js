import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { FundingContract } from '../components/ethereum_connectors/FundingContract.js';
import { Card, ListGroup, Button, Table } from 'react-bootstrap';
import web3 from '../components/ethereum_connectors/web3.js';

function VotingEventPage() {

    const [cookies, setCookie] = useCookies();
    const [fundingcontract, setfundingcontract] = useState(FundingContract(cookies.EventAddress));

    const [fundDetails, setFundDetails] = useState({});
    const [votingEventDetails, setVotingEventDetails] = useState({});
    const [voteDivision, setVoteDivision] = useState({});

    const [viewContributorsVotingTable, setViewContributorsVotingTable] = useState(false);
    const [contributorsVotingTable, setContributorsVotingTable] = useState([]);

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
        console.log(temp1[cookies.VotingIndex]);
        var tempTable = [];
        var tempVoteDivision = { yes: 0, no: 0, hold: 0, total: 0 };
        temp[4].forEach((element, index) => {
            temp1[cookies.VotingIndex].polling_data.forEach((element2) => {
                if (element.contributor_address == element2.contributor_address) {
                    tempTable.push({
                        contributor_address: element.contributor_address,
                        contributor_vote_status: element2.contributor_vote_status,
                        contributor_votes: element.contributor_votes
                    });
                    element2.contributor_vote_status ?
                        tempVoteDivision.yes = tempVoteDivision.yes + parseInt(element.contributor_votes) :
                        tempVoteDivision.no = tempVoteDivision.no + parseInt(element.contributor_votes);
                }
            })
            if (tempTable[index] == undefined) {
                tempTable.push({
                    contributor_address: element.contributor_address,
                    contributor_votes: element.contributor_votes
                });
                tempVoteDivision.hold = tempVoteDivision.hold + parseInt(element.contributor_votes);
            }
            tempVoteDivision.total = tempVoteDivision.total + parseInt(element.contributor_votes);
        });
        setVoteDivision(tempVoteDivision);
        setContributorsVotingTable(tempTable);

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
                    <Card.Header><b>Voting Details</b></Card.Header>
                    <ListGroup variant="flush">
                        <ListGroup.Item><p><b>Voting Event Status</b>:&nbsp;
                            <ins style={{ color: !votingEventDetails.event_completion_status ? 'blue' : votingEventDetails.event_success_status ? 'green' : 'red' }}>
                                {!votingEventDetails.event_completion_status ? 'In Progress' : votingEventDetails.event_success_status ? 'Successcul' : "Failed"}
                            </ins></p>
                            <p> 
                                <b>Vote Alignment: </b>
                                Yes: <b style={{ color: 'green' }}>{voteDivision.yes}</b>, 
                                No: <b style={{ color: 'red' }}>{voteDivision.no}</b>, 
                                Yet to Vote: <b style={{ color: 'blue' }}>{voteDivision.hold}</b>, 
                                Total: <b>{voteDivision.total}</b>
                            </p>
                            <Button variant="primary" type="submit" onClick={() => { setViewContributorsVotingTable(!viewContributorsVotingTable) }}>
                                {!viewContributorsVotingTable ? 'View' : 'Hide'} Contributors Voting Table</Button>
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
                                                        {item.contributor_vote_status == undefined ? "Yet to Vote" : item.contributor_vote_status ? "Yes" : "No"}
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
        </>
    )
}

export default VotingEventPage