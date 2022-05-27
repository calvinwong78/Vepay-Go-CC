/* eslint-disable linebreak-style */
/* eslint-disable max-len */
const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

const admin = require("firebase-admin");
const db = admin.firestore();

const vehicleApp = express();

vehicleApp.use(cors({origin: true}));

// get all vehicle
vehicleApp.get("/vehicles", async (req, res) => {
  const snapshot = await db.collection("vehicles").get();

  const vehiclesData = [];
  snapshot.forEach((doc) => {
    const id = doc.id;
    const data = doc.data();

    vehiclesData.push({id, ...data});
  });

  res.status(200).send(JSON.stringify(vehiclesData));
});

// get vehicle by ID
vehicleApp.get("/vehicles/:id", async (req, res) => {
  const snapshot = await db.collection("vehicles").doc(req.params.id).get();

  const vehicleId = snapshot.id;
  const vehicleData = snapshot.data();

  if (!snapshot.exists) {
    return res.status(404).send({"response": "User not found!"});
  } else {
    res.status(200).send(JSON.stringify({id: vehicleId, ...vehicleData}));
  }
});

// register vehicle
vehicleApp.post("/registration", async (req, res) => {
  const snapshot = await db.collection("vehicles").get();
  const vehicle = req.body;

  const vehicleNewLicense = vehicle.licenseNumber;
  const vehicleLicenseList = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    const vehicleData = data.licenseNumber;
    vehicleLicenseList.push(vehicleData);
  });

  if (vehicleLicenseList.includes(vehicleNewLicense)) {
    return res.status(404).send({"response": "License Number Already Used!"});
  }

  db.collection("vehicles").add(vehicle);

  res.status(201).send({"response": "Vehicle Registration success!"});
});

// edit vehicle
vehicleApp.put("/vehicles/:id", async (req, res) => {
  const snapshot = await db.collection("vehicles").doc(req.params.id).get();
  const snapshotAll = await db.collection("vehicles").get();
  const body = req.body;

  const vehicleNewLicense = body.licenseNumber;
  const vehicleLicenseList = [];
  snapshotAll.forEach((doc) => {
    const data = doc.data();
    const vehicleData = data.licenseNumber;
    vehicleLicenseList.push(vehicleData);
  });

  if (!snapshot.exists) {
    return res.status(404).send({"response": "Vehicle not found!"});
  }

  if (vehicleLicenseList.includes(vehicleNewLicense)) {
    return res.status(404).send({"response": "License Number Already Used!"});
  }

  await db.collection("vehicles").doc(req.params.id).update(body);
  res.status(200).send({"response": "Vehicle updated!"});
});


// detele vehicle
vehicleApp.delete("/vehicles/:id", async (req, res) => {
  const snapshot = await db.collection("vehicles").doc(req.params.id).get();

  const vehicleId = snapshot.id;
  if (!snapshot.exists) {
    return res.status(404).send({"response": "Vehicle not found!"});
  }
  await db.collection("vehicles").doc(req.params.id).delete();

  res.status(200).send({"response": `User deleted with ID: ${vehicleId}`});
});


exports.vehicle = functions.https.onRequest(vehicleApp);
