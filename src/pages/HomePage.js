// Refer references from "React JS references.pdf" in root folder of this application
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainContract } from '../utils//ethereum_connectors/MainContract.js';
import { Card } from 'react-bootstrap';
import Web3 from 'web3';
import { useCookies } from 'react-cookie'

function HomePage() {

  // React router navigate hook
  const navigate = useNavigate();
  // React cookie hook
  const [cookies,setCookie] = useCookies();
  // Loading Main Contract to state
  const [maincontract] = useState(MainContract());
  // Loading Crowdfunding Events to state
  const [crowdfundingEvents, setCrowdfundingEvents] = useState([]);

  //this is used for loading Crowdfunding Events on page load
  useEffect(() => {
    (async () => {
      let temp = await maincontract.methods.GetCrowdfundingEvents().call();
      setCrowdfundingEvents(temp.map((val, index, array) => array[array.length - 1 - index]));
    })();
  }, []);


  return (
    <div>
      <div style={{ width: "50%", margin: "0 auto" }}>
        <h1 className="text-center">Crowdfunding Campaigns</h1>
        <h3 style={{ textAlign: 'right' }}>(total fundraisers: {crowdfundingEvents.length})</h3>
        {crowdfundingEvents.map((item, index) => {
          return (
            <div key={index}>
              <Card
                className="text-center"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setCookie('FundAddress', item.crowdfunding_event_address, { path: '/' })
                  setCookie('VotingIndex', "99", { path: '/' })
                  navigate("/crowdfundingevent")
                }}>
                <Card.Header className="text-muted"> 
                  <b>
                    Fundraiser Address on the Blockchain: {item.crowdfunding_event_address}
                  </b>
                </Card.Header>
                <Card.Body>
                  <Card.Title>
                    <b>
                      {item.crowdfunding_event_title}
                    </b>
                  </Card.Title>
                  <Card.Text>
                    {item.crowdfunding_event_content} <br />
                    minimum contribution required : {Web3.utils.fromWei(item.crowdfunding_event_min_deposit.toString(), 'ether') + " Eth"}
                  </Card.Text>
                </Card.Body>
                <Card.Footer className="text-muted">
                  <b>
                    Fund Manager Address: {item.crowdfunding_event_manager_address}
                  </b>
                </Card.Footer>
              </Card>
              <br />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default HomePage