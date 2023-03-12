// Refer references from "React JS references.pdf" in root folder of this application
import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { FundingContract, FundingContractEthers } from '../../utils/ethereum_connectors/FundingContract.js';
import { Card, ListGroup, Button, Table, Modal, Form } from 'react-bootstrap';
import Web3 from 'web3';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { Rating } from 'react-simple-star-rating';
import { SendRefundEmail } from '../../utils/CrowdfundingApi.js';
import { useNavigate, Link } from 'react-router-dom';
import GoBackButton from '../../components/GoBackButton.js';

function VotingEventPage() {

    const [cookies, setCookie] = useCookies();
    const navigate = useNavigate();
    
    if (window.location.search !== "") {
        var params = new URLSearchParams(window.location.search)
        setCookie('FundAddress', params.get('FundAddress'), { path: '/' });
        setCookie('VotingIndex', params.get('VotingIndex'), { path: '/' });
        navigate("/vote");
    }

    const [fundingcontract] = useState(FundingContract(cookies.FundAddress));
    const [fundingcontractethers] = useState(FundingContractEthers(cookies.FundAddress));

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

    const [claimRefundButton, setClaimRefundButton] = useState("false");

    //this is used for loading state components on page load
    useEffect(() => {
        (async () => {
            await LoadVotingDetails();
        })();
    }, []);

    const LoadVotingDetails = async () => {
        setClaimRefundButton(await fundingcontract.methods.refund_event_success().call());
        const temp = await fundingcontract.methods.GetCrowdfundingEventDetails().call();
        setFundDetails(temp);
        const temp1 = await fundingcontract.methods.GetVotingEvents().call();
        setVotingEventDetails(temp1[cookies.VotingIndex]);
        let tempTable = [];
        let tempVoteDivision = {
            approved: temp1[cookies.VotingIndex].yes_votes,
            refused: temp1[cookies.VotingIndex].no_votes,
            yettovote: parseInt(temp[5]) - parseInt(temp1[cookies.VotingIndex].yes_votes) - parseInt(temp1[cookies.VotingIndex].no_votes),
            total: temp[5]
        };
        temp[4].forEach((element, index) => {
            temp1[cookies.VotingIndex].polling_data.forEach((element2) => {
                if (element.contributor_address === element2.contributor_address) {
                    tempTable.push({
                        contributor_address: element.contributor_address,
                        contributor_vote_status: element2.contributor_vote_status,
                        contributor_votes: element.contributor_votes
                    });
                }
            })
            if (tempTable[index] === undefined) {
                tempTable.push({
                    contributor_address: element.contributor_address,
                    contributor_votes: element.contributor_votes
                });
            }
        });
        const temp2 = await fundingcontract.methods.GetCrowdfundingDiscussionForum().call();
        let discussionsList = [];
        let total_rating = 0;
        temp2.forEach((item) => {
            if (item.index === cookies.VotingIndex) {
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

    const Vote = async (vote) => {
        setVotingButton(true);
        try {
            setMessage("Voting in progress .... !!!!");
            setPopup(true);
            if (cookies.MetamaskLoggedInAddress) {
                const temp = await fundingcontractethers
                    .VoteForVotingEvent(cookies.VotingIndex, vote);
                await temp.wait();
                setMessage("Vote recorded successfully...... !!!!" + " <br/> <br/> <a href='https://rinkeby.etherscan.io/tx/" + temp.hash + "' target='_blank'> Browse Transaction Details</a><br/>Transaction Hash: " + temp.hash);
            }
            else
                setMessage("Install/Login to Metamask browser extension to perform transactions on AJ Hybrid DAO Crowdfunding platform ... !!!");
        }
        catch (error) {
            error.reason != undefined ? setMessage("Error : " + error.reason.split("execution reverted:")[1]) :
                error?.data?.message != undefined ? setMessage("Error : " + error.data.message.split("VM Exception while processing transaction: revert")[1])
                    : setMessage("Error : " + error.message);
        }
        setVotingButton(false);
        await LoadVotingDetails();
    }

    const ClosePolling = async () => {
        setPollingButton(true);
        try {
            setMessage("Polling closure in progress .... !!!!");
            setPopup(true);
            if (cookies.MetamaskLoggedInAddress) {
                const temp = await fundingcontractethers
                    .CompleteVotingEvent(cookies.VotingIndex);
                await temp.wait();
                var refund_success = await fundingcontract.methods.refund_event_success().call();
                var temp2 = await fundingcontract.methods.GetVotingEvents().call();
                if (refund_success) {
                    await SendRefundEmail(fundDetails, temp2[temp2.length - 1], cookies.FundAddress, temp2.length - 1);
                }
                var refund_msg = refund_success ? " and claim refund emails are sent to contributors" : " ";
                var disbursal_msg = refund_success ? " " : 
                    temp2[cookies.VotingIndex].event_success_status 
                        ? ", and as more than 50% of the votes aligned towards yes, this disbursal request is approved and " + Web3.utils.fromWei(temp2[cookies.VotingIndex].amount_to_send.toString(), 'ether') + " Eth is transferred to the destination wallet address '"+temp2[cookies.VotingIndex].destination_wallet_address +"' successfully."
                            : ", and as more than 50% of the votes aligned towards no, this disbursal request is rejected and no funds are transferred from the fundraiser to the destination wallet address." ;
                setMessage("Polling closed successfully" + (refund_msg === " " ? disbursal_msg : refund_msg) + "...... !!!!" + " <br/> <br/> <a href='https://rinkeby.etherscan.io/tx/" + temp.hash + "' target='_blank'> Browse Transaction Details</a><br/>Transaction Hash: " + temp.hash);
            }
            else
                setMessage("Install/Login to Metamask browser extension to perform transactions on AJ Hybrid DAO Crowdfunding platform ... !!!");
        }
        catch (error) {
            error.reason != undefined ? setMessage("Error : " + error.reason.split("execution reverted:")[1]) :
                error?.data?.message != undefined ? setMessage("Error : " + error.data.message.split("VM Exception while processing transaction: revert")[1])
                    : setMessage("Error : " + error.message);
        }
        setPollingButton(false);
        await LoadVotingDetails();
    }

    const SubmitComment = async (e) => {
        e.preventDefault();
        if (comment === "" || rating === 0) {
            window.alert("comment or rating cannot be empty");
        }
        else {
            setCommentButton(true);
            try {
                setMessage("Comment posting in progress .... !!!!");
                setPopup(true);
                if (cookies.MetamaskLoggedInAddress) {
                    const temp = await fundingcontractethers
                        .CrowdfundingDiscussionForum(
                            cookies.VotingIndex,
                            comment,
                            rating)
                    await temp.wait();
                    setMessage("Comment posted successfully...... !!!!" + " <br/> <br/> <a href='https://rinkeby.etherscan.io/tx/" + temp.hash + "' target='_blank'> Browse Transaction Details</a><br/>Transaction Hash: " + temp.hash);
                }
                else
                    setMessage("Install/Login to Metamask browser extension to perform transactions on AJ Hybrid DAO Crowdfunding platform ... !!!");
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

    const ClaimRefund = async (e) => {
        try {
            setMessage("Refund in progress .... !!!!");
            setPopup(true);
            if (cookies.MetamaskLoggedInAddress) {
                const temp = await fundingcontractethers.ClaimRefund();
                await temp.wait();
                setMessage("Refunded successfully ...... !!!!" + " <br/> <br/> <a href='https://rinkeby.etherscan.io/tx/" + temp.hash + "' target='_blank'> Browse Transaction Details</a><br/>Transaction Hash: " + temp.hash);
            }
            else
                setMessage("Install/Login to Metamask browser extension to perform transactions on AJ Hybrid DAO Crowdfunding platform ... !!!");
        }
        catch (error) {
            error.reason != undefined ? setMessage("Error : " + error.reason.split("execution reverted:")[1]) :
                error?.data?.message != undefined ? setMessage("Error : " + error.data.message.split("VM Exception while processing transaction: revert")[1])
                    : setMessage("Error : " + error.message);
        }
        await LoadVotingDetails();
    }


    return (
        <>
            <div style={{ width: "60%", margin: "0 auto" }}>
                <GoBackButton link="/crowdfundingevent"/>
                <h1 className="text-center" >{votingEventDetails?.title}</h1>
                <h3 className="text-center" >{votingEventDetails?.body}</h3>
                <Card>
                    <Card.Header><b>Fund Details</b></Card.Header>
                    <ListGroup variant="flush">
                        <ListGroup.Item><b>Fund Address</b>: {cookies.FundAddress}</ListGroup.Item>
                        <ListGroup.Item><b>Manager Address</b>: {fundDetails[2]}</ListGroup.Item>
                        <ListGroup.Item><b>Fund Balance</b>: {Web3.utils.fromWei(fundDetails[6] === undefined ? '0' : fundDetails[6].toString(), 'ether') + " Eth"}</ListGroup.Item>
                        <ListGroup.Item><b>Contributors Info</b>: {fundDetails[4]?.length + ' contributors have ' + fundDetails[5] + ' votes.'}</ListGroup.Item>
                    </ListGroup>
                </Card>
                <br />
                <Card>
                    <Card.Header>
                        <div className="d-flex justify-content-between">
                            <b>Voting Details {votingEventDetails.refund_event ? <span style={{ color: 'red' }}><b> (Refund Request)</b></span> : <span style={{ color: 'green' }}><b> (Disbursal Request)</b></span>}</b>
                            <div className="d-flex justify-content-end">
                                {claimRefundButton && votingEventDetails.event_success_status && votingEventDetails.event_completion_status && votingEventDetails.refund_event ?
                                    <Button
                                        variant="success"
                                        type="submit"
                                        disabled={!claimRefundButton}
                                        onClick={ClaimRefund}
                                    >
                                        Claim Refund
                                    </Button> : <></>
                                }
                                &nbsp;
                                <Button
                                    variant="primary"
                                    type="submit"
                                    disabled={pollingButton}
                                    onClick={ClosePolling}
                                >
                                    Finish {!votingEventDetails.refund_event ? "Disbursal" : "Refund"} Request
                                </Button>
                            </div>
                        </div>
                    </Card.Header>
                    <ListGroup variant="flush">
                        <ListGroup.Item><b>Destination Wallet Address</b>: {votingEventDetails.refund_event ? <span style={{ color: 'red' }}><b>Refund All Contributors</b></span> : votingEventDetails.destination_wallet_address}</ListGroup.Item>
                        <ListGroup.Item><b>Amount Being Sent</b>: {Web3.utils.fromWei(votingEventDetails.amount_to_send === undefined ? '0' : votingEventDetails.amount_to_send.toString(), 'ether') + " Eth"}{votingEventDetails.refund_event ? " divided proportionally accross the contributors" : ""}</ListGroup.Item>
                        <ListGroup.Item><b>Request Status</b>:&nbsp;
                            <ins style={{ color: !votingEventDetails.event_completion_status ? 'blue' : votingEventDetails.event_success_status ? 'green' : 'red' }}>
                                {!votingEventDetails.event_completion_status ? 'In Progress' : votingEventDetails.event_success_status ? 'Successful' : "Failed"}
                            </ins>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <p>
                                <b>Vote Alignment: </b>
                                Approved votes: <b style={{ color: 'green' }}>{voteDivision.approved}</b>,
                                Refused votes: <b style={{ color: 'red' }}>{voteDivision.refused}</b>,
                                Yet to vote votes: <b style={{ color: 'blue' }}>{voteDivision.yettovote}</b>,
                                Total votes: <b>{voteDivision.total}</b>
                            </p>
                            <Button variant="info"
                                type="submit"
                                onClick={() => { setViewContributorsVotingTable(!viewContributorsVotingTable) }}>
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
                                                    <td>{Web3.utils.fromWei((item.contributor_votes * fundDetails[3]).toString(), 'ether') + " Eth"}</td>
                                                    <td>{item.contributor_votes}</td>
                                                    <td style={{ color: item.contributor_vote_status === undefined ? 'white' : item.contributor_vote_status ? 'green' : 'red' }}>
                                                        {item.contributor_vote_status === undefined ? "Yet to Vote" : item.contributor_vote_status ? "Approved" : "Refused"}
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
                                <h4>Discussion Form for {votingEventDetails.refund_event ? "Refund" : "Disbursal"} Request</h4>
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
                        <Modal.Title>AJ Hybrid DAO Crowdfunding Platform</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            <b
                                style={{ color: message.includes('progress') ? 'blue' : message.includes('Error') || message.includes('Login') || message.includes('aligned towards no') ? 'red' : 'green' }}
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
                                : 
                        <></>}
                    </Modal.Body>
                </Modal>
            </div>
        </>
    )
}

export default VotingEventPage