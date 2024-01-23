import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getMessaging } from "firebase/messaging"
 
const firebaseConfig = {
    apiKey: "AIzaSyAIxvIBjZFRaAKTg3IS8YQ4fXHfnQA_AC4",
    authDomain: "codeflowmiviajep4.firebaseapp.com",
    projectId: "codeflowmiviajep4",
    storageBucket: "codeflowmiviajep4.appspot.com",
    messagingSenderId: "239418664935",
    appId: "1:239418664935:web:179126ec4a0f3809797f42",
    measurementId: "G-JRF1F928L1"
  };

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const messaging = getMessaging(app);