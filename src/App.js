// Refer references from "React JS references.pdf" in root folder of this application
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CreateFundingEventPage from './pages/CreateFundingEventPage';
import FundingPage from './pages/FundingPage';
import VotingEventPage from './pages/VotingEventPage';
import User from './pages/User';
import NavigationBar from './components/NavigationBar';

function App() {

  return (
    <div>
      <NavigationBar />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/create' element={<CreateFundingEventPage />} />
        <Route path='/fund' element={< FundingPage />} />
        <Route path='/vote' element={< VotingEventPage />} />
        <Route path='/user' element={< User />} />
      </Routes>
    </div>
  )
}

export default App;
