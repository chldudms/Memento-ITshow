import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Switch -> Routes로 변경
import Start from './pages/start';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Start />} /> 
      </Routes>
    </Router>
  );
};

export default App;
