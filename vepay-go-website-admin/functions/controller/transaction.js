/* eslint-disable linebreak-style */
/* eslint-disable max-len */
const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

const admin = require("firebase-admin");
const db = admin.firestore();

const transApp = express();

transApp.use(cors({origin: true}));

// get all transaction
transApp.get("/transactions", async (req, res) => {
  const snapshot = await db.collection("transactions").get();

  const transactionData = [];
  snapshot.forEach((doc) => {
    const id = doc.id;
    const data = doc.data();

    transactionData.push({id, ...data});
  });

  res.status(200).send(JSON.stringify(transactionData));
});

// get transaction by ID
transApp.get("/transactions/:id", async (req, res) => {
  const transactionData = [];
  const snapshot = await db.collection("transactions").doc(req.params.id).get();

  snapshot.forEach((doc) => {
    const id = doc.id;
    const data = doc.data();
    transactionData.push({id, ...data});
  });

  if (transactionData.length === 0) {
    return res.status(404).send({"response": "Transaction not found!"});
  } else {
    res.status(200).send(JSON.stringify(transactionData));
  }
});

// Post transaction
transApp.post("/transactions", async (req, res) => {
  const transactionData = [];
  const transaction = req.body;
  const snapshotVehicle = await db.collectionGroup("vehicles").where("licenseNumber", "==", transaction.licenseNumber).get();
  const snapshotTransaction = await db.collection("transactions").where("licenseNumber", "==", transaction.licenseNumber).where("status", "==", "inside").get();
  const today = new Date().toLocaleString("en-US", {timeZone: "Asia/Jakarta"});

  const vehicleData = [];
  let ownerId;
  snapshotVehicle.forEach((doc) => {
    const data = doc.data();
    ownerId = data.ownerId;
    vehicleData.push(data);
  });

  snapshotTransaction.forEach((doc) => {
    const data = doc.data();
    transactionData.push(data);
  });

  if (transactionData.length > 0) {
    return res.status(404).send({"response": "Vehicle already inside!"});
  }

  if (vehicleData.length === 0) {
    return res.status(404).send({"response": "Vehicle not found!"});
  }


  db.collection("transactions").add({
    ownerId: ownerId,
    licenseNumber: transaction.licenseNumber,
    fullDateEnter: today,
    fullDateOut: "-",
    price: "-",
    status: "inside",
  });

  res.status(201).send({"response": "Vehicle In!"});
});

// update transaction
transApp.put("/transactions", async (req, res) => {
  const vehicleData = [];
  const transaction = req.body;
  const snapshot = await db.collection("transactions").where("licenseNumber", "==", transaction.licenseNumber).where("status", "==", "inside").get();

  const today = new Date().toLocaleString("en-US", {timeZone: "Asia/Jakarta"});

  snapshot.forEach((doc) => {
    const data = doc.data();
    vehicleData.push(data);
  });

  if (vehicleData.length === 0) {
    return res.status(404).send({"response": "Transaction not found!"});
  }

  const price = 5000;

  snapshot.forEach(function(document) {
    document.ref.update({
      fullDateOut: today,
      price: price,
      status: "finished",
    });
  });

  res.status(200).send({"response": "Transaction Done!"});
});


// detele transaction
transApp.delete("/transactions/:id", async (req, res) => {
  const snapshot = await db.collection("transactions").doc(req.params.id).get();

  const transactionId = snapshot.id;
  if (!snapshot.exists) {
    return res.status(404).send({"response": "Transaction not found!"});
  }
  await db.collection("transactions").doc(req.params.id).delete();

  res.status(200).send({"response": `Transaction deleted with ID: ${transactionId}`});
});

// check if license plate already inside
transApp.get("/inside/:plat", async (req, res) => {
  const transactionData = [];
  const snapshotTransaction = await db.collection("transactions").where("licenseNumber", "==", req.params.plat).where("status", "==", "inside").get();
  snapshotTransaction.forEach((doc) => {
    const data = doc.data();
    transactionData.push(data);
  });

  if (transactionData.length === 0) {
    return res.status(200).send({"response": 0});
  }
  res.status(200).send({"response": 1});
});

exports.transaction = functions.https.onRequest(transApp);
