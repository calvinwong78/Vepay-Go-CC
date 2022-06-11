// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/auth"
import "firebase/compat/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBAOStBherV_91U_O_V1wJQTTYKaTaQ9Kg",
  authDomain: "vepay-go.firebaseapp.com",
  databaseURL: "https://vepay-go-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "vepay-go",
  storageBucket: "vepay-go.appspot.com",
  messagingSenderId: "414238140587",
  appId: "1:414238140587:web:915bbcc55acea4e9d5efee"
};

firebase.initializeApp(firebaseConfig)


export default firebase
