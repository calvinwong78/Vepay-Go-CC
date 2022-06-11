import React from 'react';
import firebase from '../Firebase';
import { getMessaging, getToken } from "firebase/messaging";

function FCM() {
  const messaging = getMessaging();
  getToken(messaging, { vapidKey: 'BEbvcttL61UptSHoKH-VMZ9MUBghGi_xTQAa6RxYHdgFo2TNxTEkB-8_W_exMLepIiNKCHkakz4PzXuZoXkB5Xo' }).then((currentToken) => {
  if (currentToken) {
    console.log(currentToken);
  } else {
    // Show permission request UI
    console.log('No registration token available. Request permission to generate one.');
    // ...
  }
}).catch((err) => {
  console.log('An error occurred while retrieving token. ', err);
  // ...
});
  return (
    <div className="">
          Hi My Push Notification service   
    </div>
  );
}

export default FCM;
