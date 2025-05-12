// src/firebase.js
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBtHvQv2ePdKzE8tVfWbADQ-Codvtu9g1E",
  authDomain: "salip-d76d3.firebaseapp.com",
  projectId: "salip-d76d3",
  storageBucket: "salip-d76d3.appspot.com",
  messagingSenderId: "237055139750",
  appId: "1:237055139750:web:4c186ea506d846c60cb967",
  measurementId: "G-DR97X44WB5"
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

export { auth, db }
