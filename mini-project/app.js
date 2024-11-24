import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, collection, query, where, getDocs, getDoc } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import replace from './modules/replaceTemplate.js';
import { getChatResponse } from './gemini-pro.js'; // Import the chatbot function

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCRJsN2eueB7fGUitfTdIu5gDiwxyuAy_4",
  authDomain: "pawsitivity-3.firebaseapp.com",
  projectId: "pawsitivity-3",
  storageBucket: "pawsitivity-3.appspot.com",
  messagingSenderId: "507770082835",
  appId: "1:507770082835:web:39a309ae8b6a108aa991e6"
};

// Linux code test

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

const petCollection = collection(db, 'pets');

const app = express();
app.use(express.json());
// app.use(morgan('combined'));

// __dirname resolution in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/adopt', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'adopt.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cont.html'));
});

app.get('/signin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/pets/:id', async (req, res) => {
  const eventId = req.params.id;
  const eventDocRef = doc(db, "pets", eventId);
  const eventDocSnapshot = await getDoc(eventDocRef);
  const tempEvent = fs.readFileSync(path.join(__dirname, 'templates', 'temp-pet.html'), 'utf-8');
  if (eventDocSnapshot.exists()) {
    const eventData = eventDocSnapshot.data();
    const currentImgRef = ref(storage, `pets/${eventId}.png`);
    const imageUrl = await getDownloadURL(currentImgRef);
    eventData.imageUrl = imageUrl;
    const output = replace(tempEvent, eventData);
    res.status(200).send(output);
  } else {
    res.status(404).send('Pet not found');
  }
});

app.get('/pets/filter/:type', async (req, res) => {
  const filt = req.params.type;
  const dbWord = filt.charAt(0).toUpperCase() + filt.slice(1);
  // console.log(dbWord);
  try {
    const q = query(petCollection, where("pet", "==", `${dbWord}`));

    const snapshot = await getDocs(q);
    const tempCard = fs.readFileSync(path.join(__dirname, 'templates', 'temp-cards.html'), 'utf-8');
    const promises = snapshot.docs.map(async element => {
      const petData = element.data();
      petData.id = element.id;
      const currentImgRef = ref(storage, `pets/${element.id}.png`);
      const imageUrl = await getDownloadURL(currentImgRef);
      petData.imageUrl = imageUrl;
      return replace(tempCard, petData);
    });
    const cardHtml = (await Promise.all(promises)).join('');
    const output = fs.readFileSync(path.join(__dirname, 'templates', 'temp-petlist.html'), 'utf8').replace(/{%PET_CARD%}/g, cardHtml);
    res.status(200).send(output);
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
})

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

app.get('/upforadoption', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'adoptionForm.html'));
})
app.get('/pets', async (req, res) => {
  try {
    const snapshot = await getDocs(petCollection);
    const tempCard = fs.readFileSync(path.join(__dirname, 'templates', 'temp-cards.html'), 'utf-8');
    const promises = snapshot.docs.map(async element => {
      const petData = element.data();
      petData.id = element.id;
      const currentImgRef = ref(storage, `pets/${element.id}.png`);
      const imageUrl = await getDownloadURL(currentImgRef);
      petData.imageUrl = imageUrl;
      return replace(tempCard, petData);
    });
    const cardHtml = (await Promise.all(promises)).join('');
    const output = fs.readFileSync(path.join(__dirname, 'templates', 'temp-petlist.html'), 'utf8').replace(/{%PET_CARD%}/g, cardHtml);
    res.status(200).send(output);
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  try {
    const chatResponse = await getChatResponse(message);
    res.json({ text: chatResponse });
  } catch (error) {
    console.error('Error in chatbot request:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
