import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar, Container, Nav } from 'react-bootstrap';
import HomePage from './pages/HomePage';
import TestPage from './pages/TestPage';

function App() {
  return (
    <div>
      <Navbar bg="dark">
        <Container>
          <Navbar.Brand href="/"><img width="200" height="100" src={require('./images/companylogo.png')} /></Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link style={{color: "white"}} href="/">Home</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Router>
        <Routes>
          <Route path='/' element={<HomePage />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App;
