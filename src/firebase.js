
//   export default db;

import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyA1sWdwJcBEGJCqBoXyigym1sZN1PbaQvs",
  authDomain: "instagram-clone-bea5a.firebaseapp.com",
  projectId: "instagram-clone-bea5a",
  storageBucket: "instagram-clone-bea5a.appspot.com",
  messagingSenderId: "512623048154",
  appId: "1:512623048154:web:24df52a13883e74f287ce3"  
  
});


/*1. to access db
2. to do authentication
3. to upload pictures etc*/
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const storage = firebaseApp.storage();

export {db, auth, storage};

