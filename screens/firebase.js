import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyBKnm0Dsp3eLdR8HsYfhQyoNjvo3M_wi20",
  authDomain: "users-e0d03.firebaseapp.com",
  projectId: "users-e0d03",
  storageBucket: "users-e0d03.appspot.com",
  messagingSenderId: "241235006084",
  appId: "1:241235006084:web:bf7052da684a0cb04768d1",
  measurementId: "G-SGZW4M3H20"
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
export default firebase;