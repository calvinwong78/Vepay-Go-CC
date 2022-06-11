import React from 'react';
import '../../App.css';
import FCM from '../FCM';
import Footer from '../Footer';
import Navbar from '../Navbar';


export default function Products() {
  return (
    <>
        <Navbar />
      <FCM/>
      <Footer />
    </>
  );
}
