import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { FundingContract, FundingContractEthers } from '../components/ethereum_connectors/FundingContract.js';
import { Card, ListGroup, Button, Table, Modal, Form } from 'react-bootstrap';
import Web3 from 'web3';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { Rating } from 'react-simple-star-rating';

function VotingEventPage() {

    const [cookies, setCookie] = useCookies();
    if (window.location.search != "") {
        var params = new URLSearchParams(window.location.search)
        setCookie('FundAddress', params.get('FundAddress'), { path: '/' });
        setCookie('VotingIndex', params.get('VotingIndex'), { path: '/' });
        window.location.href = "/vote";
    }
    const [fundingcontract, setfundingcontract] = useState(FundingContract(cookies.FundAddress));
    const [fundingcontractethers, setfundingcontractethers] = useState(FundingContractEthers(cookies.FundAddress));

    const [fundDetails, setFundDetails] = useState({});
    const [votingEventDetails, setVotingEventDetails] = useState({});
    const [voteDivision, setVoteDivision] = useState({});
    const [discussionFormList, setDiscussionFormList] = useState([]);

    const [viewContributorsVotingTable, setViewContributorsVotingTable] = useState(false);
    const [contributorsVotingTable, setContributorsVotingTable] = useState([]);

    const [votingButton, setVotingButton] = useState(false);
    const [pollingButton, setPollingButton] = useState(false);

    const [popup, setPopup] = useState(false);
    const [message, setMessage] = useState("");

    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(0);
    const [commentButton, setCommentButton] = useState(false);

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
        var tempVoteDivision = {
            approved: temp1[cookies.VotingIndex].yes_votes,
            refused: temp1[cookies.VotingIndex].no_votes,
            yettovote: parseInt(temp[5]) - parseInt(temp1[cookies.VotingIndex].yes_votes) - parseInt(temp1[cookies.VotingIndex].no_votes),
            total: temp[5]
        };
        temp[4].forEach((element, index) => {
            temp1[cookies.VotingIndex].polling_data.forEach((element2) => {
                if (element.contributor_address == element2.contributor_address) {
                    tempTable.push({
                        contributor_address: element.contributor_address,
                        contributor_vote_status: element2.contributor_vote_status,
                        contributor_votes: element.contributor_votes
                    });
                }
            })
            if (tempTable[index] == undefined) {
                tempTable.push({
                    contributor_address: element.contributor_address,
                    contributor_votes: element.contributor_votes
                });
            }
        });
        const temp2 = await fundingcontract.methods.GetCrowdfundingDiscussionForum().call();
        var discussionsList = [];
        var total_rating = 0;
        temp2.forEach((item) => {
            if (item.index == cookies.VotingIndex) {
                total_rating = total_rating + parseInt(item.rating)
                discussionsList.push({
                    comment: item.comment,
                    comment_address: item.comment_address,
                    rating: item.rating,
                    total_rating: total_rating
                });
            }
        });
        setDiscussionFormList(discussionsList);
        setVoteDivision(tempVoteDivision);
        setContributorsVotingTable(tempTable);

    }

    var Vote = async (vote) => {
        setVotingButton(true);
        try {
            setMessage("Voting in progress .... !!!!");
            setPopup(true);
            const temp = await fundingcontractethers
                .VoteForVotingEvent(cookies.VotingIndex, vote);
            await temp.wait();
            setMessage("Vote recorded successfully...... !!!!" + " <br/> <br/> <a href='https://rinkeby.etherscan.io/tx/" + temp.hash + "' target='_blank'> Browse Transaction Details</a><br/>Transaction Hash: " + temp.hash);
        }
        catch (error) {
            error.reason != undefined ? setMessage("Error : " + error.reason.split("execution reverted:")[1]) :
                error?.data?.message != undefined ? setMessage("Error : " + error.data.message.split("VM Exception while processing transaction: revert")[1])
                    : setMessage("Error : " + error.message);
        }
        setVotingButton(false);
        await LoadVotingDetails();
    }

    var ClosePolling = async () => {
        setPollingButton(true);
        try {
            setMessage("Close polling in progress .... !!!!");
            setPopup(true);
            const temp = await fundingcontractethers
                .CompleteVotingEvent(cookies.VotingIndex);
            await temp.wait();
            setMessage("Polling closed successfully...... !!!!" + " <br/> <br/> <a href='https://rinkeby.etherscan.io/tx/" + temp.hash + "' target='_blank'> Browse Transaction Details</a><br/>Transaction Hash: " + temp.hash);
        }
        catch (error) {
            error.reason != undefined ? setMessage("Error : " + error.reason.split("execution reverted:")[1]) :
                error?.data?.message != undefined ? setMessage("Error : " + error.data.message.split("VM Exception while processing transaction: revert")[1])
                    : setMessage("Error : " + error.message);
        }
        setPollingButton(false);
        await LoadVotingDetails();
    }

    var SubmitComment = async (e) => {
        e.preventDefault();
        if (comment == "" || rating == 0) {
            window.alert("comment or rating cannot be empty");
        }
        else {
            setCommentButton(true);
            try {
                setMessage("Comment submission in progress .... !!!!");
                setPopup(true);
                const temp = await fundingcontractethers
                    .CrowdfundingDiscussionForum(
                        cookies.VotingIndex,
                        comment,
                        rating)
                await temp.wait();
                setMessage("Comment submission success...... !!!!" + " <br/> <br/> <a href='https://rinkeby.etherscan.io/tx/" + temp.hash + "' target='_blank'> Browse Transaction Details</a><br/>Transaction Hash: " + temp.hash);
            }
            catch (error) {
                error.reason != undefined ? setMessage("Error : " + error.reason.split("execution reverted:")[1]) :
                    error?.data?.message != undefined ? setMessage("Error : " + error.data.message.split("VM Exception while processing transaction: revert")[1])
                        : setMessage("Error : " + error.message);
            }
            setCommentButton(false);
            await LoadVotingDetails();
            setComment("");
            setRating(0);
        }
    }


    return (
        <>
            <div style={{ width: "60%", margin: "0 auto" }}>
                <h1 className="text-center" >{votingEventDetails?.title}</h1>
                <h3 className="text-center" >{votingEventDetails?.body}</h3>
                <Card>
                    <Card.Header><b>Fund Details</b></Card.Header>
                    <ListGroup variant="flush">
                        <ListGroup.Item><b>Fund Address</b>: {cookies.FundAddress}</ListGroup.Item>
                        <ListGroup.Item><b>Manager Address</b>: {fundDetails[2]}</ListGroup.Item>
                        <ListGroup.Item><b>Fund Balance</b>: {Web3.utils.fromWei(fundDetails[6] == undefined ? '0' : fundDetails[6].toString(), 'ether') + " eth"}</ListGroup.Item>
                        <ListGroup.Item><b>Contributors Info</b>: {fundDetails[4]?.length + ' contributors have ' + fundDetails[5] + ' votes.'}</ListGroup.Item>
                    </ListGroup>
                </Card>
                <br />
                <Card>
                    <Card.Header>
                        <b>Voting Details {votingEventDetails.refund_event ? <span style={{ color: 'red'}}><b> (refund event)</b></span>: " "}</b>
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={pollingButton}
                            onClick={ClosePolling}
                            style={{ float: 'right' }}
                        >
                            Finish Voting Event
                        </Button>
                    </Card.Header>
                    <ListGroup variant="flush">
                        <ListGroup.Item><b>Destination Wallet Address</b>: { votingEventDetails.refund_event ? <span style={{ color: 'red'}}><b>Refund All Contributors</b></span> : votingEventDetails.destination_wallet_address}</ListGroup.Item>
                        <ListGroup.Item><b>Amount Being Sent</b>: {Web3.utils.fromWei(votingEventDetails.amount_to_send == undefined ? '0' : votingEventDetails.amount_to_send.toString(), 'ether') + " eth"}</ListGroup.Item>
                        <ListGroup.Item><b>Voting Event Status</b>:&nbsp;
                            <ins style={{ color: !votingEventDetails.event_completion_status ? 'blue' : votingEventDetails.event_success_status ? 'green' : 'red' }}>
                                {!votingEventDetails.event_completion_status ? 'In Progress' : votingEventDetails.event_success_status ? 'Successful' : "Failed"}
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
                            <span style={{ float: 'right' }}>
                                <Button variant="success" type="submit" disabled={votingButton} onClick={() => { Vote(1) }}>Approve</Button>&nbsp;
                                <Button variant="danger" type="submit" disabled={votingButton} onClick={() => { Vote(0) }}>Refuse</Button>
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
                                                    <td>{Web3.utils.fromWei((item.contributor_votes * fundDetails[3]).toString(), 'ether') + " eth"}</td>
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

                <div>
                    <br />
                    <Card>
                        <Card.Header>
                            <div className='d-flex justify-content-between'>
                                <h4>Discussion Form for Voting Event</h4>
                                <div>
                                    <span>Overall Rating: </span>
                                    <Rating
                                        ratingValue={discussionFormList[discussionFormList.length - 1]?.total_rating / discussionFormList.length}
                                        readonly={true}
                                        size={40}
                                    >
                                    </Rating>
                                </div>
                            </div>
                        </Card.Header>
                        <br />
                        {discussionFormList.map((item, index) => {
                            return (
                                <div key={index}>
                                    <Card style={{ width: "90%", margin: "0 auto" }}>
                                        <Card.Header>
                                            <div className='d-flex justify-content-between'>
                                                <b>User: {item.comment_address}</b>
                                                <Rating
                                                    ratingValue={parseInt(item.rating)}
                                                    readonly={true}
                                                    size={30}
                                                >
                                                </Rating>
                                            </div>
                                        </Card.Header>
                                        <Card.Body>
                                            <Card.Text>
                                                {item.comment}
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                    <br />
                                </div>
                            )
                        })
                        }
                        <Form style={{ width: "90%", margin: "0 auto" }}>
                            <Form.Group className="mb-3">
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Enter your comments..!!"
                                    onChange={(e) => { setComment(e.target.value) }}
                                />
                                <br />
                                <Button
                                    variant="primary"
                                    type="submit"
                                    disabled={commentButton}
                                    onClick={SubmitComment}
                                >
                                    Comment
                                </Button>
                                <Rating
                                    ratingValue={rating}
                                    onClick={(e) => { setRating(e) }}
                                >
                                </Rating>
                                <span> {'<<--'} Please give your star rating here</span>
                            </Form.Group>
                        </Form>
                    </Card>
                </div>
                <Modal
                    show={popup}
                    onHide={async () => {
                        setPopup(false);
                    }}
                    size="lg"
                    centered>
                    <Modal.Header closeButton>
                        <Modal.Title>AJ Crowdfunding Platform Message Popup</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            <b
                                style={{ color: message.includes('progress') ? 'blue' : message.includes('Error') ? 'red' : 'green' }}
                                dangerouslySetInnerHTML={{ __html: message }}
                            >
                            </b>
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

export default VotingEventPage