import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SlideRedirect from './pages/SlideRedirect';
import Game from './pages/Game';

function App() {
  return (
    <Router>
      <div className="scroll-smooth freelancer-font min-h-screen bg-[#e8f0ec]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/slide" element={<SlideRedirect />} />
          <Route path="/slide/" element={<SlideRedirect />} />
          <Route path="/game" element={<Game />} />
          <Route path="/game/" element={<Game />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
