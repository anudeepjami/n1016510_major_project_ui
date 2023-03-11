// Refer references from "React JS references.pdf" in root folder of this application
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CreateCrowdfundingEventPage from './pages/CreateCrowdfundingEventPage';
import CrowdfundingEventPage from './pages/crowdfunding-event-page/CrowdfundingEventPage';
import VotingEventPage from './pages/VotingEventPage';
import User from './pages/User';
import NavigationBar from './components/NavigationBar';

function App() {

  return (
    <div>
      <NavigationBar />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/createcrowdfundingevent' element={<CreateCrowdfundingEventPage />} />
        <Route path='/crowdfundingevent' element={< CrowdfundingEventPage />} />
        <Route path='/votingevent' element={< VotingEventPage />} />
        <Route path='/user' element={< User />} />
      </Routes>
    </div>
  );
}

export default App;
