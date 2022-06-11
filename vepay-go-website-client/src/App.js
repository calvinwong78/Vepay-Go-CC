import React from 'react';
import Navbar from './components/Navbar';
import './App.css';
import Home from './components/pages/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Services from './components/pages/Services';
import Products from './components/pages/Products';
import SignUp from './components/pages/SignUp';
import Form from './components/Form';

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' exact element={<Home/>} />
          <Route path='/services' exact element={<Services/>} />
          <Route path='/products' exact element={<Products/>} />
          <Route path='/sign-up' exact element={<SignUp/>} />
          <Route path='/login' element={<Form title="Login" />} />
          <Route path='/register' element={<Form title="Register" />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
