import firebase from 'firebase'

const config = {
  apiKey: "AIzaSyD5-7juOre7ryyV0OXNRz08PIttXn6NEvM",
  authDomain: "lumiere-75500.firebaseapp.com",
  databaseURL: "https://lumiere-75500.firebaseio.com",
  projectId: "lumiere-75500",
  storageBucket: "lumiere-75500.appspot.com",
  messagingSenderId: "833974121271"
};

firebase.initializeApp(config);

export default firebase;