/* eslint-disable linebreak-style */
/* eslint-disable max-len */
const functions = require("firebase-functions");
const admin = require("firebase-admin");

exports.UserSignup = functions.auth.user().onCreate((user) => {
  return admin.firestore().collection("admin").doc(user.uid).set({
    email: user.email,
    ID: user.uid,
  });
});

exports.UserDelete = functions.auth.user().onDelete((user) => {
  const doc = admin.firestore().collection("admin").doc(user.uid);
  return doc.delete();
});
