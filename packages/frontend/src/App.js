import './global.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import ContentsPage from './ContentsPage';
import MessageboardPage from './MessageboardPage';
import ThreadView from './components/ThreadView';

const NotFound = () => (
  <div style={{
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    color: 'white',
    backgroundColor: 'black',
    textAlign: 'center'
  }}>
    <p>404 - Page Not Found</p>
  </div>
);

const App = () => {
  return (
    <Router>
      <>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/contents" element={<ContentsPage />} />
          <Route path="/messageboard" element={<MessageboardPage />} />
          <Route path="/thread/:id" element={<ThreadView />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </>
    </Router>
  );
};

export default App;
