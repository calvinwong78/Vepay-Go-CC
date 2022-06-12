import React, { useState } from "react";
import "./Register.css";
import { Button } from "./Button";
import { useNavigate } from "react-router-dom";
import firebase from "firebase/compat";
import { getAuth } from "firebase/auth";
import { ToastContainer, toast } from 'react-toastify';


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
      "https://us-central1-vepay-go.cloudfunctions.net/vehicle/registration/" +
      uid;
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
        setMessage("Vehicle Registered");
      } else {
        setMessage("Some error occured");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div class="card-body py-5 px-md-5">
      <div class="row g-0 d-flex align-items-center">
        <div class="col-lg-4 d-none d-lg-flex">
          <img
            src="https://mdbootstrap.com/img/new/ecommerce/vertical/004.jpg"
            alt="Trendy Pants and Shoes"
            class="w-100 rounded-t-5 rounded-tr-lg-0 rounded-bl-lg-5"
          />
        </div>
        <div class="col-lg-8">
          <div class="card-body py-5 px-md-5">
            <form onSubmit={handleSubmit}>
              <div class="form-outline mb-4">
                <input
                  type="text"
                  value={VehicleID}
                  placeholder="vehicleID"
                  class="form-control"
                  onChange={(e) => setVehicleID(e.target.value)}
                />
              </div>
              <div class="form-outline mb-4">
                <input
                  type="text"
                  value={vehicleType}
                  placeholder="vehicleType"
                  class="form-control"
                  onChange={(e) => setvehicleType(e.target.value)}
                />
              </div>
              <button type="submit" class="btn btn-primary btn-block mb-4">
                Register
              </button>

              <div className="message">{message ? <p>{message}</p> : null}</div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Registration;
