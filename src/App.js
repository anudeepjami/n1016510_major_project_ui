// Refer references from "React JS references.pdf" in root folder of this application
import React, { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar, Container, Nav, Button, Card, ListGroup } from 'react-bootstrap';
import HomePage from './pages/HomePage';
import CreateFundingEventPage from './pages/CreateFundingEventPage';
import FundingPage from './pages/FundingPage';
import VotingEventPage from './pages/VotingEventPage';
import User from './pages/User';

function App() {

  const [cookies, setCookie] = useCookies();

  //this is used to detect metamask wallet address change
  useEffect(() => {
    if (typeof window.ethereum != "undefined") {
      var RefreshPageOnMetmaskChange = async () => {
        // Refresh page on meta mask account change
        window.ethereum.on("accountsChanged", async (accounts) => {
          setCookie('MetamaskLoggedInAddress', accounts[0], { path: '/' });
          window.location.reload(true);
        });
        // Refresh page on meta mask network change
        window.ethereum.on("chainChanged", async (chainId) => {
          setCookie('MetamaskNetwork', chainId, { path: '/' });
          window.location.reload(true);
        });
      }
      RefreshPageOnMetmaskChange();
    }
  }, []);

  return (
    <div>
      <Navbar bg="dark">
        <Container className="d-flex justify-content-between">
          <Navbar.Brand href="/"><img width="400" height="100" src={require('./images/companylogo.png')} /></Navbar.Brand>
          <Nav>
            <Nav.Link href="/create"><Button variant="primary">Create a Fundraiser</Button></Nav.Link>
            <Nav.Link style={{ color: "white" }} href="/user"><Button variant="primary">Profile</Button></Nav.Link>
          </Nav>
          <Nav>
            <Navbar.Text>
              <Card>
                <Card.Header>
                  {cookies.MetamaskNetwork != undefined ? "Ethereum Network: " : ""}
                  <b>
                    <span style={{ color: 'green' }}>
                      {cookies.MetamaskNetwork == "0x4" && !window.location.href.includes("localhost") ? "Rinkeby Netowrk" : ""}
                      {cookies.MetamaskNetwork == "0x1691" && window.location.href.includes("localhost") ? "Local Ganache Network" : ""}
                    </span>
                    <span style={{ color: 'red' }}>
                      {cookies.MetamaskNetwork != "0x4" && !window.location.href.includes("localhost") ? "Only Rinkeby Network Supported" : ""}
                      {cookies.MetamaskNetwork != "0x1691" && window.location.href.includes("localhost") ? "Only Local Ganache Network Supported" : ""}
                    </span>
                  </b>
                </Card.Header>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <b>
                      <span style={{ color: 'green' }}>
                        {cookies.MetamaskLoggedInAddress != undefined ? cookies.MetamaskLoggedInAddress : ""}
                      </span>
                      <span style={{ color: 'red' }}>
                        {cookies.MetamaskLoggedInAddress == undefined ? "Read only mode enabled as Metamask is not logged in" : ""}
                      </span>
                    </b>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Navbar.Text>
          </Nav>
        </Container>
      </Navbar>
      <Router>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/create' element={<CreateFundingEventPage />} />
          <Route path='/fund' element={< FundingPage />} />
          <Route path='/vote' element={< VotingEventPage />} />
          <Route path='/user' element={< User />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App;
