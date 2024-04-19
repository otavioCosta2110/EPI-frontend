import React from 'react';
import Header from './Header/header';
import Home from './home.js'; 

function App() {
  return (
    <div>
      <Header />
      <Home />
      {/* Renderize outras telas conforme necessário */}
    </div>
  );
}

export default App;
