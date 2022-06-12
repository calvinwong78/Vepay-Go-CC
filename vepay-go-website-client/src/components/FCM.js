import React, { useState } from "react";
import firebase from "../Firebase";
import { getMessaging, getToken } from "firebase/messaging";
import { getAuth, onAuthStateChanged } from "firebase/auth";


function FCM() {
  const messaging = getMessaging();
  const [message, setMessage] = useState("");
  getToken(messaging, {
    vapidKey:
      "BEbvcttL61UptSHoKH-VMZ9MUBghGi_xTQAa6RxYHdgFo2TNxTEkB-8_W_exMLepIiNKCHkakz4PzXuZoXkB5Xo",
  })
    .then((currentToken) => {
      if (currentToken) {
        const auth = getAuth();
        const user = auth.currentUser;
        const uid = user.uid;
        const tab =
          "https://us-central1-vepay-go.cloudfunctions.net/user/registration/token/" + uid 
          ;
          try {
            let res =  fetch(tab, {
              method: "POST",
              headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                token: currentToken,
              }),
            });
            console.log(res);
          } catch (err) {
            console.log(err);
          }
          
      } else {
        // Show permission request UI
        console.log(
          "No registration token available. Request permission to generate one."
        );
        // ...
      }
    })
    .catch((err) => {
      console.log("An error occurred while retrieving token. ", err);
      // ...
    });
  return <div className="">Push Notification</div>;
}

export default FCM;
