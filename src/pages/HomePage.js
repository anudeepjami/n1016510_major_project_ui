import React, { useState, useEffect } from 'react';
import maincontract from '../components/ethereum_connectors/maincontract';
import { Card } from 'react-bootstrap';
import web3 from 'web3';

function HomePage() {

  const [crowdfundingEvents, setCrowdfundingEvents] = useState([]);
  //this is used for loading state components on page load
  useEffect(() => {
    (async () => {
      const temp = await maincontract.methods.GetCrowdfundingEvents().call();
      var temp_reverse = [];
      for (let i = temp.length; i > 0; i--) {
        temp_reverse.push(temp[i-1]);
      }
      setCrowdfundingEvents(temp_reverse);
    })();
  }, []);

  return (
    <div>
      <div style={{ width: "50%", margin: "0 auto" }}>
        <h1 className="text-center">Crowdfunding Events</h1>
        <h3 style={{ textAlign: 'right' }}>(total events: {crowdfundingEvents.length})</h3>
        {crowdfundingEvents.map((item, index) => {
          return (
            <div key={index}>
              <Card className="text-center">
                <Card.Header> Block Chain Address of crowdfunding event: {item.crowdfunding_event_address}</Card.Header>
                <Card.Body>
                  <Card.Title className="text-muted">{item.crowdfunding_event_title}</Card.Title>
                  <Card.Text>
                    {item.crowdfunding_event_content} <br />
                    minimum contribution required : {web3.utils.fromWei(item.crowdfunding_event_min_deposit, 'ether') + " eth"}
                  </Card.Text>
                </Card.Body>
                <Card.Footer className="text-muted">fund manager: {item.crowdfunding_event_manager_address}</Card.Footer>
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