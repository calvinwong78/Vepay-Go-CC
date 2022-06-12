/* eslint-disable linebreak-style */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const App = express();
App.use(cors({origin: true}));

App.post("/sendNTF/:id", async (req, res) => {
  const FCMToken = req.params.id;
  const payload = {
    token: FCMToken,
    notification: {
      title: "Vepay-Go",
      body: "Terjadi Transaksi",
    },
  };
  admin.messaging().send(payload).then((response) => {
    // Response is a message ID string.
    console.log("Successfully sent message:", response);
    return {success: true};
  }).catch((error) => {
    return {error: error.code};
  });
});

exports.FCM = functions.https.onRequest(App);
