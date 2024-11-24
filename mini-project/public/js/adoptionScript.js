// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-storage.js";
import { getFirestore, collection, addDoc, doc } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCRJsN2eueB7fGUitfTdIu5gDiwxyuAy_4",
    authDomain: "pawsitivity-3.firebaseapp.com",
    projectId: "pawsitivity-3",
    storageBucket: "pawsitivity-3.appspot.com",
    messagingSenderId: "507770082835",
    appId: "1:507770082835:web:39a309ae8b6a108aa991e6"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);
const petsCollection = collection(db, 'pets');

const submitBtn = document.getElementById('submit-btn');

submitBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    const file = document.getElementById('file-input').files[0];

    if (!file) {
        alert('Please upload an image');
        return; 
    }
    // const dateUploaded = new Date().toISOString().replace(/[-:.]/g, ''); // Example format: 20240616230824
// const uploadTask = uploadBytesResumable(storageRef, file);
    try{

       
    const docRef = await addDoc(petsCollection, {
        'name':document.getElementById('name').value,
        'contactNo': document.getElementById('contact-no').value,
        'email' : document.getElementById('email').value,
        'pet' : document.getElementById('pet').value,
        'breed': document.getElementById('breed').value,
        'message' : document.getElementById('message').value,
        'location' : document.getElementById('location').value,
    });    
    console.log(docRef.id);
    const storageRef = ref(storage, `pets/${docRef.id}.png`);
    await uploadBytesResumable(storageRef, file);

    // Get download URL of the uploaded file
    // const imageUrl = await getDownloadURL(storageRef);
    alert('Form submitted successfully!');
    
} catch(error){
        console.error('Error adding document: ', error);
    }
});