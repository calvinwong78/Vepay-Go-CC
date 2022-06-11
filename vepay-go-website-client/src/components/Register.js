import React, { useState } from "react";
import "./Register.css";
import { Button } from "./Button";
import { useNavigate } from "react-router-dom";
import firebase from "firebase/compat";
import { getAuth } from "firebase/auth";
function Registration(setEmail) {
  const [VehicleID, setVehicleID] = useState("");
  const [vehicleType, setvehicleType] = useState("");
  const [message, setMessage] = useState("");
  let navigate = useNavigate();
  const db = firebase.firestore();
  let handleSubmit = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    const user = auth.currentUser;
    const uid = user.uid;
    const tab =
      "https://us-central1-vepay-go.cloudfunctions.net/vehicle/registration/" + uid 
      ;
    try {
      let res = await fetch(tab, {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          licenseNumber: VehicleID,
          vehicleType: vehicleType,
        }),
      });
      console.log(res);
      let resJson = await res.json();
      if (res.status === 201) {
        setVehicleID("");
        setvehicleType("");
        setMessage("User created successfully");
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
          value={VehicleID}
          placeholder="vehicleID"
          onChange={(e) => setVehicleID(e.target.value)}
        />
         <input
          type="text"
          value={vehicleType}
          placeholder="vehicleType"
          onChange={(e) => setvehicleType(e.target.value)}
        />

        <button type="submit">Create</button>

        <div className="message">{message ? <p>{message}</p> : null}</div>
      </form>
    </div>
  );
}
export default Registration;
