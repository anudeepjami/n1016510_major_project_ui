// Refer references from "React JS references.pdf" in root folder of this application
import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { FundingContract, FundingContractEthers } from '../../utils/ethereum_connectors/FundingContract.js';
import { Card, Button, Form, InputGroup } from 'react-bootstrap';
import Web3 from 'web3';
import { SendEmail } from '../../utils/CrowdfundingApi.js';
import CustomModal from '../../components/CustomModal.js';
import ContributeComponent from './ContributeComponent.js';
import ContributorsTable from './ContributorsTable.js';
import VotingEventsTable from './VotingEventsTable.js';
import DiscussionForm from '../../components/DiscussionForm.js';
import CreateVotingEventFormComponent from './CreateVotingEventFormComponent.js';
import { Link } from 'react-router-dom';


function FundingPage() {

    //react cookie custom react hook
    const [cookies, setCookie] = useCookies();

    //modal state
    const [modal, setModal] = useState({ pop: false, msg: "" });

    const [fundingcontract] = useState(FundingContract(cookies.FundAddress));
    const [fundingcontractethers] = useState(FundingContractEthers(cookies.FundAddress));

    const [fundDetails, setFundDetails] = useState({});
    const [votingEventDetails, setVotingEventDetails] = useState([]);
    const [discussionFormList, setDiscussionFormList] = useState([]);

    const [viewContributorsTable, setViewContributorsTable] = useState(false);
    const [viewVotingEventsTable, setViewVotingEventsTable] = useState(false);
    const [viewCreateVotingEventForm, setViewCreateVotingEventForm] = useState(false);
    const [viewRefund, setViewRefund] = useState(false);

    const [contributeButtonStatus, setContributeButtonStatus] = useState(false);
    const [createVotingEventButtonStatus, setCreateVotingEventButtonStatus] = useState(false);

    const [depositAmount, setDepositAmount] = useState("");

    const [createVotingEventDetails, setCreateVotingEventDetails] = useState({
        title: "",
        description: "",
        destination_address: "",
        deposit_amount: ""
    });

    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(0);
    const [commentButtonStatus, setCommentButtonStatus] = useState(false);

    //this is used for loading state components on page load
    useEffect(() => {
        (async () => {
            await LoadFundDetails();
            if (cookies.VotingIndex !== "99") {
                setCookie('VotingIndex', "99", { path: '/' });
                window.location.href = "/fund";
            }
        })();
    }, []);

    const LoadFundDetails = async () => {
        setFundDetails(await fundingcontract.methods.GetCrowdfundingEventDetails().call());
        setVotingEventDetails(await fundingcontract.methods.GetVotingEvents().call());
        const temp = await fundingcontract.methods.GetCrowdfundingDiscussionForum().call();
        let discussionsList = [];
        let total_rating = 0;
        temp.forEach((item) => {
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
    }

    const ContributeFunds = async () => {
        setCreateVotingEventButtonStatus(true);
        try {
            setModal({ ...modal, pop: true, msg: "User Contribution in progress .... !!!!" });
            if (cookies.MetamaskLoggedInAddress) {
                const temp = await fundingcontractethers
                    .DepositToCrowdfundingEvent({ value: Web3.utils.toWei(depositAmount, 'ether') })
                await temp.wait();
                setModal({
                    ...modal,
                    pop: true,
                    msg: `User Contribution successful...... !!!!  <br/> <br/> 
                        <a href='https://rinkeby.etherscan.io/tx/" + ${temp.hash} target='_blank'> Browse Transaction Details </a> <br/>
                        Transaction Hash: " + ${temp.hash}`
                });
            }
            else
                setModal({ ...modal, pop: true, msg: "Install/Login to Metamask browser extension to perform transactions on AJ Hybrid DAO Crowdfunding platform ... !!!" });
        }
        catch (error) {
            error.reason !== undefined ?
                setModal({ ...modal, pop: true, msg: `Error : ${(error.reason.includes("execution reverted:") ? error.reason.split("execution reverted:")[1] : error.reason)}` }) :
                error?.data?.message !== undefined ?
                    setModal({ ...modal, pop: true, msg: `Error : ${error.data.message.split("VM Exception while processing transaction: revert")[1]}` }) :
                    setModal({ ...modal, pop: true, msg: `Error : ${error.message}` });
        }
        setCreateVotingEventButtonStatus(false);
        await LoadFundDetails();
    }

    const CreateVotingEvent = async (e) => {
        console.log(createVotingEventDetails);
        setContributeButtonStatus(true);
        try {
            setModal({ ...modal, pop: true, msg: (`${(e.target.id === "refund" ? "Refund" : "Disbursal")} request creation in progress .... !!!!`) });
            if (cookies.MetamaskLoggedInAddress) {
                const temp = await fundingcontractethers
                    .CreateAnVotingEvent(
                        createVotingEventDetails.title,
                        createVotingEventDetails.description,
                        viewRefund ? cookies.FundAddress : createVotingEventDetails.destination_address,
                        viewRefund ? fundDetails[6].toString() : Web3.utils.toWei(createVotingEventDetails.deposit_amount, 'ether'),
                        e.target.id === "refund" ? 1 : 0)
                await temp.wait();
                const temp2 = await fundingcontract.methods.GetVotingEvents().call();
                await SendEmail(fundDetails, temp2[temp2.length - 1], cookies.FundAddress, temp2.length - 1);
                setModal({ ...modal, pop: true, msg: `${(e.target.id === "refund" ? "Refund" : "Disbursal")} request created and emails sent to contributors successfully...... !!!!" + " <br/> <br/> <a href='https://rinkeby.etherscan.io/tx/$(temp.hash) target='_blank'> Browse Transaction Details</a><br/>Transaction Hash:  ${temp.hash}` });
            }
            else
                setModal({ ...modal, pop: true, msg: `Install/Login to Metamask browser extension to perform transactions on AJ Hybrid DAO Crowdfunding platform ... !!!` });
        }
        catch (error) {
            error.reason !== undefined ?
                setModal({ ...modal, pop: true, msg: `Error : ${(error.reason.includes("execution reverted:") ? error.reason.split("execution reverted:")[1] : error.reason)}` }) :
                error?.data?.message !== undefined ?
                    setModal({ ...modal, pop: true, msg: `Error : ${error.data.message.split("VM Exception while processing transaction: revert")[1]}` }) :
                    setModal({ ...modal, pop: true, msg: `Error : ${error.message}` });
        }
        setContributeButtonStatus(false);
        await LoadFundDetails();
    }

    const SubmitComment = async (e) => {
        e.preventDefault();
        if (comment === "" || rating === 0) {
            window.alert("comment or rating cannot be empty");
        }
        else {
            setCommentButtonStatus(true);
            try {
                setModal({ ...modal, pop: true, msg: `Comment posting in progress .... !!!!` });
                if (cookies.MetamaskLoggedInAddress) {
                    const temp = await fundingcontractethers
                        .CrowdfundingDiscussionForum(
                            cookies.VotingIndex,
                            comment,
                            rating)
                    await temp.wait();
                    setModal({ ...modal, pop: true, msg: `Comment posted successfully...... !!!! <br/> <br/> <a href='https://rinkeby.etherscan.io/tx/${temp.hash} target='_blank'> Browse Transaction Details</a><br/>Transaction Hash: ${temp.hash}` });
                }
                else
                    setModal({ ...modal, pop: true, msg: `Install/Login to Metamask browser extension to perform transactions on AJ Hybrid DAO Crowdfunding platform ... !!!` });
            }
            catch (error) {
                error.reason !== undefined ?
                    setModal({ ...modal, pop: true, msg: `Error : ${(error.reason.includes("execution reverted:") ? error.reason.split("execution reverted:")[1] : error.reason)}` }) :
                    error?.data?.message !== undefined ?
                        setModal({ ...modal, pop: true, msg: `Error : ${error.data.message.split("VM Exception while processing transaction: revert")[1]}` }) :
                        setModal({ ...modal, pop: true, msg: `Error : ${error.message}` });
            }
            setCommentButtonStatus(false);
            await LoadFundDetails();
            setComment("");
            setRating(0);
        }
    }


    return (
        <>
            <div style={{ width: "60%", margin: "0 auto" }}>
                <Button variant="link">
                    <Link to="/">
                        {'<- '}Go Back
                    </Link>
                </Button>
                <h1 className="text-center" >{fundDetails[0]}</h1>
                <h3 className="text-center" >{fundDetails[1]}</h3>
                <h5 className='d-flex justify-content-between'>
                    <div>
                        Fund Details: (Fund Address : {cookies.FundAddress})
                    </div>
                    <div>
                        <Button
                            variant="info"
                            type="submit"
                            disabled={window.location.href.includes('localhost')}
                            onClick={() => {
                                window.open('https://rinkeby.etherscan.io/address/' + cookies.FundAddress, '_blank', 'noopener,noreferrer');
                            }}>
                            History
                        </Button>
                    </div>
                </h5>
                <Card>
                    <Card.Header as="h4">Fund Manager Details</Card.Header>
                    <Card.Body>
                        <Card.Title>{fundDetails[2]}</Card.Title>
                        <Card.Text>
                            This is the wallet address of the fund manager who created this fundraiser.
                        </Card.Text>
                    </Card.Body>
                </Card>
                <br />
                <div className='d-flex'>

                    {/* Contribution Component */}
                    <ContributeComponent
                        fundDetails={fundDetails}
                        contributeButtonStatus={contributeButtonStatus}
                        ContributeFunds={ContributeFunds}
                        setDepositAmount={setDepositAmount} />
                    {/*  */}

                    <Card className='m-1'>
                        <Card.Header as="h4">Fund Balance</Card.Header>
                        <Card.Body>
                            <Card.Title>{Web3.utils.fromWei(fundDetails[6] === undefined ? '0' : fundDetails[6].toString(), 'ether') + " Eth"}</Card.Title>
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
                                    variant="info"
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
                        <Card.Header as="h4">Disbursal/Refund Requests</Card.Header>
                        <Card.Body>
                            <Card.Title>{fundDetails[7]}</Card.Title>
                            <Card.Text>
                                Disbursal/Refund requests present in this fund.
                                <br /><br />
                                <Button
                                    variant="primary"
                                    type="submit"
                                    onClick={() => {
                                        setViewCreateVotingEventForm(!viewCreateVotingEventForm)
                                    }}>
                                    {!viewCreateVotingEventForm ? 'Create Request' : 'Hide Create Request'}
                                </Button>
                                <br /><br />

                                {/* Create Voting Event for refund or disbursal form */}
                                {viewCreateVotingEventForm &&
                                    <CreateVotingEventFormComponent
                                        createVotingEventDetails={createVotingEventDetails}
                                        setCreateVotingEventDetails={setCreateVotingEventDetails}
                                        viewRefund = {viewRefund}
                                        setViewRefund = {setViewRefund}
                                        CreateVotingEvent = {CreateVotingEvent}
                                        createVotingEventButtonStatus = {createVotingEventButtonStatus}
                                    />
                                }
                                {/*  */}

                                <Button
                                    variant="info"
                                    type="submit"
                                    onClick={() => {
                                        setViewVotingEventsTable(!viewVotingEventsTable)
                                        setViewContributorsTable(false)
                                    }}>
                                    {!viewVotingEventsTable ? 'View' : 'Hide'} Disbursal/Refund Requests
                                </Button>

                                <br /><br />
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </div>

                {/* All Tables */}
                <div>
                    {/* Contributors table component*/}
                    {viewContributorsTable &&
                        <ContributorsTable
                            fundDetails={fundDetails}
                        />
                    }
                    {/*  */}
                </div>
                <div>
                    {/* Voting events table compnonent*/}
                    {viewVotingEventsTable &&
                        <VotingEventsTable
                            votingEventDetails={votingEventDetails}
                        />}
                    {/* */}
                </div>
                {/* All Tables */}

                <div>
                    <br />
                    {/* Discussion Form */}
                    <DiscussionForm
                        discussionFormList={discussionFormList}
                        commentButtonStatus={commentButtonStatus}
                        rating={rating}
                        setRating={setRating}
                        setComment={setComment}
                        SubmitComment={SubmitComment}
                    />
                    {/* Discussion Form */}
                </div>

                {/* Custom Modal */}
                <CustomModal
                    modal={modal}
                    setModal={setModal} />
                {/* */}

            </div>
        </>
    )
}

export default FundingPage