import React, { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import HomePage from './pages/HomePage';
import CreateFundingEventPage from './pages/CreateFundingEventPage';
import FundingPage from './pages/FundingPage';
import VotingEventPage from './pages/VotingEventPage';
import detectEthereumProvider from '@metamask/detect-provider';
import web3 from './components/ethereum_connectors/web3';

function App() {

  const[cookies, setCookie] = useCookies();

  //this is used for loading state components on page load
  useEffect(() => {
    var MetamaskAccountChangeDetector = async () => {
      window.ethereum.on("accountsChanged", async () => {
        const metamaskLoggedInAddress = await web3.eth.getAccounts();
        setCookie('MetamaskLoggedInAddress', metamaskLoggedInAddress[0], { path: '/' });
        window.location.reload(true);
      });
    }
    MetamaskAccountChangeDetector();
  }, []);

  return (
    <div>
      <Navbar bg="dark">
        <Container>
          <Navbar.Brand href="/"><img width="200" height="100" src={require('./images/companylogo.png')} /></Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link style={{ color: "white" }} href="/">Home</Nav.Link>
          </Nav>
          <Nav className="justify-content-end">
            <Nav.Link href="/create"><Button variant="primary">Create Funding Event</Button></Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Router>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/create' element={<CreateFundingEventPage />} />
          <Route path='/fund' element={< FundingPage />} />
          <Route path='/vote' element={< VotingEventPage />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App;
