import React, {useState} from 'react';
import './Register.css';
import { Button } from './Button';
import { useNavigate } from 'react-router-dom';

function Registration() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [Password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    let navigate = useNavigate();
  
    let handleSubmit = async (e) => {
      e.preventDefault();
      try {
        let res = await fetch("https://us-central1-vepay-go.cloudfunctions.net/user/registration", {
          method: "POST",
          headers: {
    
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: email,
            fullname: name,
            password: Password
          }),
        });
        console.log(res)
        let resJson = await res.json();
        if (res.status === 201) {
          setName("");
          setEmail("");
          setPassword("");
          setMessage("User created successfully");
          navigate("/")
        } else {
          setMessage("Some error occured");
        }
      } catch (err) {
        console.log(err);
      }
    };
  
    return (
      <div className="Registration">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            value={Password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
  
          <button type="submit">Create</button>
  
          <div className="message">{message ? <p>{message}</p> : null}</div>
        </form>
      </div>
    );
  }
export default Registration;