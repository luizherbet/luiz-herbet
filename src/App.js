import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

// Importações para outras páginas (descomentadas conforme necessário)
// import About from './pages/About';
// import Books from './pages/Books';
// import Blog from './pages/Blog';
// import Contact from './pages/Contact';

function App() {
  return (
    <Router>
      <div className="scroll-smooth exo-2-font bg-gradient-to-b from-blue-50 to-orange-100 pl-2 pr-2">
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Descomente as linhas abaixo para outras rotas */}
          {/* <Route path="/about" element={<About />} />
        <Route path="/books" element={<Books />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
