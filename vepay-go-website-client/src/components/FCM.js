import React from 'react';
import firebase from '../Firebase';
import "@firebase/messaging"
function FCM() {

  React.useEffect(()=>{
    const msg=firebase.messaging();
    msg.requestPermission().then(()=>{
      return msg.getToken();
    }).then((data)=>{
      console.warn("token",data)
    })
  })
  return (
    <div className="">
        
          Hi My Push Notification service   

    </div>
  );
}

export default FCM;
