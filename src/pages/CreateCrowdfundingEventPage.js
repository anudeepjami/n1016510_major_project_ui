// Refer references from "React JS references.pdf" in root folder of this application
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Form, Button } from 'react-bootstrap';
import { MainContractEthers } from '../utils/ethereum_connectors/MainContract.js';
import Web3 from 'web3';
import { useCookies } from 'react-cookie';
import CustomModal from '../components/CustomModal.js'

function CreateCrowdfundingEventPage() {

  // 
  const navigate = useNavigate();
  const [cookies] = useCookies();
  const [maincontractethers] = useState(MainContractEthers());
  const [crowdfundingEvents, setCrowdfundingEvents] = useState({
    title: "",
    content: "",
    min_deposit: 0.1
  });

  //modal state
  const [modal, setModal] = useState({ pop: false, msg: "" });

  const [buttonStatus, setButtonStatus] = useState(false);


  var CreateCrowdfundingEvent = async () => {
    setButtonStatus(true);
    try {
      setModal({ ...modal, pop: true, msg: `Fundraiser creation in progress .... !!!!` });
      if (cookies.MetamaskLoggedInAddress) {
        const temp = await maincontractethers
          .CreateCrowdfundingEvent(
            crowdfundingEvents.title,
            crowdfundingEvents.content,
            Web3.utils.toWei(crowdfundingEvents.min_deposit, 'ether'));
        await temp.wait();
        setModal({ ...modal, pop: true, msg: `Fundraiser created successfully ...... !!!! <br/> <br/> <a href='https://rinkeby.etherscan.io/tx/${temp.hash} target='_blank'> Browse Transaction Details</a><br/>Transaction Hash: ${temp.hash}` });
        setTimeout(() => {navigate("/")}, 2000);
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
    setButtonStatus(false);
  }

  return (
    <>
      <div style={{ width: "50%", margin: "0 auto" }} >
        <h1>Create a Fundraiser</h1>
        <Form>
          <Form.Group className="mb-4">
            <Form.Label>Title :</Form.Label>
            <Form.Control 
              id='1' 
              type="text" 
              placeholder='Enter fundraiser title (cannot be empty)'
              onChange={(e)=>{ setCrowdfundingEvents({ ...crowdfundingEvents, title: e.target.value })}} />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>Info :</Form.Label>
            <Form.Control 
              id='2' 
              type="text" 
              placeholder='Enter some info about your fundraiser (cannot be empty)'
              onChange={(e)=>{ setCrowdfundingEvents({ ...crowdfundingEvents, content: e.target.value })}} />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>Minimum contribution of Ether required to become a contributor of the fundraiser : (Enter value in Ether)</Form.Label>
            <Form.Control 
              id='3' 
              type="number" 
              min="0.1" 
              placeholder={0.1}
              onChange={(e) => { setCrowdfundingEvents({ ...crowdfundingEvents, min_deposit: e.target.value }) }} />
          </Form.Group>
          <Button
            variant="primary"
            type="submit"
            disabled={buttonStatus}
            onClick={CreateCrowdfundingEvent}
          >
            Create
          </Button>
        </Form>

        {/* Custom Modal */}
        <CustomModal
          modal={modal}
          setModal={setModal} />
        {/* */}

      </div>
    </>

  )
}

export default CreateCrowdfundingEventPage