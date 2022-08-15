import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import HomePage from './pages/HomePage';
import CreateFundingEventPage from './pages/CreateFundingEventPage';

function App() {
  return (
    <div>
      <Navbar bg="dark">
        <Container>
          <Navbar.Brand href="/"><img width="200" height="100" src={require('./images/companylogo.png')} /></Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link style={{color: "white"}} href="/">Home</Nav.Link>
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
        </Routes>
      </Router>
    </div>
  )
}

export default App;
