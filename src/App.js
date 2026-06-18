import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BookRead from './pages/BookRead';

function App() {
  return (
    <Router>
      <div className="scroll-smooth pipa-font min-h-screen bg-[#faf7f2] px-2 md:px-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/livro" element={<BookRead />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
