import * as firebase from 'firebase';

const config = {
    apiKey: "AIzaSyAW6fBYHpu_C6XAk0Hj8NGh1xPivAWTI0Y",
    authDomain: "besocial-e12fa.firebaseapp.com",
    databaseURL: "https://besocial-e12fa.firebaseio.com",
    projectId: "besocial-e12fa",
    storageBucket: "besocial-e12fa.appspot.com",
    messagingSenderId: "400756179494"
  };

firebase.initializeApp(config);

export default firebase;