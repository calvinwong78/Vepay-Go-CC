/* eslint-disable linebreak-style */
/* eslint-disable max-len */
const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

const admin = require("firebase-admin");
const db = admin.firestore();
const userDb = db.collection("users");

const vehicleApp = express();

vehicleApp.use(cors({origin: true}));

// get all vehicle
vehicleApp.get("/vehicles", async (req, res) => {
  const snapshot = await db.collectionGroup("vehicles").get();

  const vehiclesData = [];
  snapshot.forEach((doc) => {
    const id = doc.id;
    const data = doc.data();

    vehiclesData.push({id, ...data});
  });

  res.status(200).send(JSON.stringify(vehiclesData));
});

// get vehicle by ID
vehicleApp.get("/vehicles/:plat", async (req, res) => {
  const vehicleData = [];
  const snapshot = await db.collectionGroup("vehicles").where("licenseNumber", "==", req.params.plat).get();

  snapshot.forEach((doc) => {
    const id = doc.id;
    const data = doc.data();
    vehicleData.push({id, ...data});
  });

  if (vehicleData.length === 0) {
    return res.status(404).send({"response": "Vehicle not found!"});
  } else {
    res.status(200).send(JSON.stringify(vehicleData));
  }
});

// register vehicle
vehicleApp.post("/registration/:id", async (req, res) => {
  const snapshot = await db.collectionGroup("vehicles").get();
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

  userDb.doc(req.params.id).collection("vehicles").add({
    ownerId: req.params.id,
    licenseNumber: vehicle.licenseNumber,
    vehicleType: vehicle.vehicleType,
  });

  res.status(201).send({"response": "Vehicle Registration success!"});
});

// edit vehicle
vehicleApp.put("/vehicles/:plat", async (req, res) => {
  const vehicleData = [];
  const snapshot = await db.collectionGroup("vehicles").where("licenseNumber", "==", req.params.plat).get();
  const snapshotAll = await db.collectionGroup("vehicles").get();
  const body = req.body;

  const vehicleNewLicense = body.licenseNumber;
  const vehicleLicenseList = [];
  snapshotAll.forEach((doc) => {
    const data = doc.data();
    const vehicleData = data.licenseNumber;
    vehicleLicenseList.push(vehicleData);
  });

  snapshot.forEach((doc) => {
    const data = doc.data();
    vehicleData.push(data);
  });

  if (vehicleData.length === 0) {
    return res.status(404).send({"response": "Vehicle not found!"});
  }

  if (vehicleLicenseList.includes(vehicleNewLicense)) {
    return res.status(404).send({"response": "License Number Already Used!"});
  }

  snapshot.forEach(function(document) {
    document.ref.update(body);
  });

  res.status(200).send({"response": "Vehicle updated!"});
});


// detele vehicle
vehicleApp.delete("/vehicles/:plat", async (req, res) => {
  const vehicleData = [];
  const snapshot = await db.collectionGroup("vehicles").where("licenseNumber", "==", req.params.plat).get();

  snapshot.forEach((doc) => {
    const id = doc.id;
    const data = doc.data();
    vehicleData.push({id, ...data});
  });

  if (vehicleData.length === 0) {
    return res.status(404).send({"response": "Vehicle not found!"});
  }

  snapshot.forEach(function(document) {
    document.ref.delete();
  });

  res.status(200).send({"response": `Vehicle deleted with number: ${req.params.plat}`});
});


exports.vehicle = functions.https.onRequest(vehicleApp);
