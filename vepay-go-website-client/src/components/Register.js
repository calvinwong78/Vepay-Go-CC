import React, {useState} from 'react';
import './Register.css';
import { Button } from './Button';
import { useNavigate } from 'react-router-dom';
import db from '../Firebase';

function Registration(setEmail) {
    const [VehicleID, setVehicleID] = useState("");
    const [message, setMessage] = useState("");
    let navigate = useNavigate();
  
    let handleSubmit = async (e) => {
      e.preventDefault();




      
     /* try {
        let res = await fetch("https://us-central1-vepay-go.cloudfunctions.net/user/registration", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
       
            licenseNumber: VehicleID,
         
          }),
        });
        console.log(res)
        let resJson = await res.json();
        if (res.status === 201) {
          setVehicleID("");
          setMessage("User created successfully");
        } else {
          setMessage("Some error occured");
        }
      } catch (err) {
        console.log(err);
      }*/
    };
  
    return (
      <div className="Registration">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={VehicleID}
            placeholder="vehicleID"
            onChange={(e) => setVehicleID(e.target.value)}
          />
  
          <button type="submit">Create</button>
  
          <div className="message">{message ? <p>{message}</p> : null}</div>
        </form>
      </div>
    );
  }
export default Registration;