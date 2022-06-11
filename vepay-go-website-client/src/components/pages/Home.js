import React, { useEffect } from 'react';
import '../../App.css';
import Cards from '../Cards';
import HeroSection from '../HeroSection';
import Footer from '../Footer';
import { useNavigate } from 'react-router-dom'
import Navbar from '../Navbar';
function Home() {
let navigate = useNavigate();
useEffect(() => {
    let authToken = sessionStorage.getItem('Auth Token')
    if (authToken) {
        navigate('/home')
    }

    if (!authToken) {
        navigate('/register')
    }
}, [])
  return (
    <>
      <Navbar />
      <HeroSection />
      <Cards />
      <Footer />
    </>
  );
}

export default Home;
