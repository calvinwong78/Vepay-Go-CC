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
  const today = new Date();
  const date = today.getFullYear()+"-"+(today.getMonth()+1)+"-"+today.getDate();
  const yearEnter = today.getFullYear();
  const monthEnter = (today.getMonth()+1);
  const dateEnter = today.getDate();

  const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const hoursEnter = today.getHours();
  const minutesEnter = today.getMinutes();
  const secondsEnter = today.getSeconds();

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
    fullDateEnter: date,
    yearEnter: yearEnter,
    monthEnter: monthEnter,
    dateEnter: dateEnter,
    timeEnter: time,
    hoursEnter: hoursEnter,
    minutesEnter: minutesEnter,
    secondsEnter: secondsEnter,
    fullDateOut: "-",
    yearOut: "-",
    monthOut: "-",
    dateOut: "-",
    timeOut: "-",
    hoursOut: "-",
    minutesOut: "-",
    secondsOut: "-",
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

  const today = new Date();
  const date = today.getFullYear()+"-"+(today.getMonth()+1)+"-"+today.getDate();
  const yearOut = today.getFullYear();
  const monthOut = (today.getMonth()+1);
  const dateOut = today.getDate();

  const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const hoursOut = today.getHours();
  const minutesOut = today.getMinutes();
  const secondsOut = today.getSeconds();

  // let dateEnter = "";
  // let yearEnter = "";
  // let monthEnter = "";

  // let hoursEnter = "";
  // let minutesEnter = "";
  snapshot.forEach((doc) => {
    const data = doc.data();
    // dateEnter = data.dateEnter;
    // yearEnter = data.yearEnter;
    // monthEnter = data.monthEnter;

    // hoursEnter = data.hoursEnter;
    // minutesEnter = data.minutesEnter;
    vehicleData.push(data);
  });

  if (vehicleData.length === 0) {
    return res.status(404).send({"response": "Transaction not found!"});
  }

  const price = 5000;
  // const maxPrice = 10000;

  // if (dateOut - dateEnter > 0 || yearOut - yearEnter > 0 || monthOut - monthEnter > 0) {
  //   price = maxPrice;
  // } else {
  //   const hourInMinutes = (hoursOut-hoursEnter)*60;
  //   const totalMinutes = minutesOut-minutesEnter;
  //   if (hourInMinutes < 0 || totalMinutes < 60) {
  //     return price = 2000;
  //   }
  //   price = 2000 + ((hoursOut-hoursEnter)*1000);
  //   if (price > 10000) {
  //     price = maxPrice;
  //   }
  // }

  snapshot.forEach(function(document) {
    document.ref.update({
      fullDateOut: date,
      yearOut: yearOut,
      monthOut: monthOut,
      dateOut: dateOut,
      timeOut: time,
      hoursOut: hoursOut,
      minutesOut: minutesOut,
      secondsOut: secondsOut,
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


exports.transaction = functions.https.onRequest(transApp);
