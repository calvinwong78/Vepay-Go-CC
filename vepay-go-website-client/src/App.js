import React, { useContext, useEffect } from 'react';
import { useState } from 'react';
import Navbar from './components/Navbar';
import './App.css';
import Home from './components/pages/Home';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Products from './components/pages/Products';
import SignUp from './components/pages/SignUp';
import Form from './components/Form';
import firebase from './Firebase';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Registervehicle from './components/pages/RegisterVehicle';

function App() {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [setfullname, setFullname] = useState('');
let navigate = useNavigate();
const handleAction = (id) => {
  const authentication = getAuth();
  if (id === 2) {
    createUserWithEmailAndPassword(authentication, email, password)
      .then((response) => {
        navigate('/home')
        sessionStorage.setItem('Auth Token', response._tokenResponse.refreshToken);
      })
      .catch((error) => {
        if(error.code === 'auth/wrong-password'){
          toast.error('Please check the Password');
        }
        if(error.code === 'auth/user-not-found'){
          toast.error('Please check the Email');
        }
        if (error.code === 'auth/email-already-in-use') {
          toast.error('Email Already in Use');
        }
          })
 
  }
  if (id === 1) {
   signInWithEmailAndPassword(authentication, email, password)
      .then((response) => {
        navigate('/home')
        sessionStorage.setItem('Auth Token', response._tokenResponse.refreshToken)
      })
      .catch((error) => {
        if(error.code === 'auth/wrong-password'){
          toast.error('Please check the Password');
        }
        if(error.code === 'auth/user-not-found'){
          toast.error('Please check the Email');
        }
})
  }
}
useEffect(() => {
  let authToken = sessionStorage.getItem('Auth Token')

  if (authToken) {
    navigate('/home')
  }
}, [])

  return (
    <div className="App">
    <>
        <ToastContainer />
        <Routes>
          <Route path='/home' exact element={<Home/>} />
          <Route path='/products' exact element={<Products/>} />
          <Route path='/Registervehicle' exact element={<Registervehicle  setEmail={setEmail}/> } />
          <Route
              path='/'
              element={
                <Form
                  title="Login"
                  setEmail={setEmail}
                  setPassword={setPassword}
                  handleAction={() => handleAction(1)}
                />}
            />
            <Route
              path='/register'
              element={
                <Form
                  title="Register"
                  setEmail={setEmail}
                  setPassword={setPassword}
                  handleAction={() => handleAction(2)}
                />}
            />
        </Routes>
    </>
    </div>
  );
  
}

export default App;
