/* eslint-disable linebreak-style */
/* eslint-disable max-len */
const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

const userApp = express();

userApp.use(cors({origin: true}));

// get all users
userApp.get("/users", async (req, res) => {
  const snapshot = await db.collection("users").get();

  const usersData = [];
  snapshot.forEach((doc) => {
    const id = doc.id;
    const data = doc.data();

    usersData.push({id, ...data});
  });

  res.status(200).send(JSON.stringify(usersData));
});

// get user by ID
userApp.get("/users/:id", async (req, res) => {
  const snapshot = await db.collection("users").doc(req.params.id).get();

  const userId = snapshot.id;
  const userData = snapshot.data();

  if (!snapshot.exists) {
    return res.status(404).send({"response": "User not found!"});
  } else {
    res.status(200).send(JSON.stringify({id: userId, ...userData}));
  }
});

// register user
userApp.post("/registration", async (req, res) => {
  const snapshot = await db.collection("users").get();
  const user = req.body;

  const userNewEmail = user.email;
  const userEmail = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    const emailData = data.email;
    userEmail.push(emailData);
  });

  if (userEmail.includes(userNewEmail)) {
    return res.status(404).send({"response": "Email already used by another account!"});
  }

  db.collection("users").add(user);

  res.status(201).send({"response": "Registration success!"});
});

// register user data
userApp.post("/registration/token/:id", async (req, res) => {
  const userData = req.body;

  db.collection("users").doc(req.params.id).collection("userData").add({
    ownerId: req.params.id,
    token: userData.token,
  });

  res.status(201).send({"response": "User Data Registration success!"});
});

// edit user
userApp.put("/users/:id", async (req, res) => {
  const snapshot = await db.collection("users").doc(req.params.id).get();
  const snapshotAll = await db.collection("users").get();
  const body = req.body;

  const userNewEmail = body.email;
  const userEmail = [];
  snapshotAll.forEach((doc) => {
    const data = doc.data();
    const emailData = data.email;
    userEmail.push(emailData);
  });

  if (!snapshot.exists) {
    return res.status(404).send({"response": "User not found!"});
  }

  if (userEmail.includes(userNewEmail)) {
    return res.status(404).send({"response": "Email already used by another account!"});
  }

  await db.collection("users").doc(req.params.id).update(body);
  res.status(200).send("User profile updated!");
});


// detele user
userApp.delete("/users/:id", async (req, res) => {
  const snapshot = await db.collection("users").doc(req.params.id).get();

  const userId = snapshot.id;
  if (!snapshot.exists) {
    return res.status(404).send({"response": "User not found!"});
  }
  await db.collection("users").doc(req.params.id).delete();

  res.status(200).send({"response": `User deleted with ID: ${userId}`});
});


exports.user = functions.https.onRequest(userApp);
