import React, { useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { MainContractEthers } from '../components/ethereum_connectors/MainContract.js';
import Web3 from 'web3';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

function CreateFundingEventPage() {

  const [maincontractethers, setMaincontractethers] = useState(MainContractEthers());
  const [crowdfundingEvents, setCrowdfundingEvents] = useState({
    title: "Enter Title (cannot be empty)",
    content: "Enter some info about your funding campaign (cannot be empty)",
    min_deposit: "0.1"
  });
  const [popup, setPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [buttonStatus, setButtonStatus] = useState(false);

  var ChangeField = async (event) => {
    let temp = {
      title: crowdfundingEvents.title,
      content: crowdfundingEvents.content,
      min_deposit: crowdfundingEvents.min_deposit
    };
    if (event.type === "change") {
      if (event.currentTarget.id === "1")
        temp.title = event.target.value;
      if (event.currentTarget.id === "2")
        temp.content = event.target.value;
      if (event.currentTarget.id === "3")
        temp.min_deposit = event.target.value;
    }
    if (event.type === "click") {
      if (event.currentTarget.id === "1" && temp.title === "Enter Title (cannot be empty)")
        temp.title = "";
      if (event.currentTarget.id === "2" && temp.content === "Enter some info about your funding campaign (cannot be empty)")
        temp.content = "";
    }
    setCrowdfundingEvents(temp);
  }

  var CreateCrowdfundingEvent = async () => {
    setButtonStatus(true);
    try {
      setMessage("Crowdfunding campaign creation in progress .... !!!!");
      setPopup(true);
      const temp = await maincontractethers
        .CreateCrowdfundingEvent(
          crowdfundingEvents.title,
          crowdfundingEvents.content,
          Web3.utils.toWei(crowdfundingEvents.min_deposit, 'ether'));
      await temp.wait();
      setMessage(" Crowdfunding campaign created successfully ...... !!!!" + " <br/> <br/> <a href='https://rinkeby.etherscan.io/tx/" + temp.hash + "' target='_blank'> Browse Transaction Details</a><br/>Transaction Hash: " + temp.hash);
    }
    catch (error) {
      error.reason != undefined ? setMessage("Error : " + error.reason.split("execution reverted:")[1]) :
        error.data.message != undefined ? setMessage("Error : " + error.data.message.split("VM Exception while processing transaction: revert")[1])
          : setMessage("Error : " + error.message);
    }
    setButtonStatus(false);
  }

  var PopupHandler = async () => {
    message.includes("progress") || message.includes("Error") ? setPopup(false) : window.location.href = '/';
  }

  return (
    <>
      <div style={{ width: "50%", margin: "0 auto" }} >
        <h1>Create a CrowdFunding Campaign</h1>
        <Form>
          <Form.Group className="mb-4">
            <Form.Label>Title :</Form.Label>
            <Form.Control id='1' type="text" value={crowdfundingEvents.title} onClick={ChangeField} onChange={ChangeField} />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>Info :</Form.Label>
            <Form.Control id='2' type="text" value={crowdfundingEvents.content} onClick={ChangeField} onChange={ChangeField} />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>Minimum amount of Ether required to enter : (Enter value in Ether)</Form.Label>
            <Form.Control id='3' type="number" min="0.00001" value={crowdfundingEvents.min_deposit} onClick={ChangeField} onChange={ChangeField} />
          </Form.Group>
          <Button variant="primary" type="submit" disabled={buttonStatus} onClick={CreateCrowdfundingEvent}>
            Create
          </Button>
        </Form>
      </div>
      <Modal show={popup} onHide={PopupHandler} size="lg">
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
    </>

  )
}

export default CreateFundingEventPage