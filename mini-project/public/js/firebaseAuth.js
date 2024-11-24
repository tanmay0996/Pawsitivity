// import express from 'express';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import fs from 'fs';
// import multer from 'multer';

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCRJsN2eueB7fGUitfTdIu5gDiwxyuAy_4",
    authDomain: "pawsitivity-3.firebaseapp.com",
    projectId: "pawsitivity-3",
    storageBucket: "pawsitivity-3.appspot.com",
    messagingSenderId: "507770082835",
    appId: "1:507770082835:web:39a309ae8b6a108aa991e6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();


document.addEventListener("DOMContentLoaded", () => {
    const googleSignInBtn = document.getElementById('google-btn');
    const fbSignInBtn = document.getElementById('facebook-btn');
    const emailSignInForm = document.getElementById('email-signin-form');
    const emailSignUpForm = document.getElementById('email-signup');
  
    // Google authentication
    googleSignInBtn.onclick = () => {
      signInWithPopup(auth, googleProvider) 
        .then((result) => {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          const user = result.user;
          window.location.href = "/pets/";
        }).catch((error) => {
          console.error('Error signing in with Google:', error);
        });
    }
  
    // Email sign-in
    if (emailSignInForm) {
      emailSignInForm.onsubmit = (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
  
        signInWithEmailAndPassword(auth, email, password)
          .then(result => {
            window.location.href = "/pets/";
          })
          .catch(error => {
            alert('Error signing in with Email:', error.message);
          });
      }
    }
  
    // Email sign-up
    if (emailSignUpForm) {
      emailSignUpForm.onsubmit = (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const pass = document.getElementById('password').value;
  
        createUserWithEmailAndPassword(auth, email, pass)
          .then(result => {
            window.location.href = "/pets/";
          })
          .catch(error => {
            alert('Error signing up with Email:', error.message);
          });
      }
    }
  });
  