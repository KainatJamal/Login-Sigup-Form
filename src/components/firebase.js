import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
const firebaseConfig = {
  apiKey: "AIzaSyCZ8K0e4Y9Cbk5JyX2PZIjIgP2jwbIcubs",
  authDomain: "real-time-chat-app-37616.firebaseapp.com",
  projectId: "real-time-chat-app-37616",
  storageBucket: "real-time-chat-app-37616.appspot.com",
  messagingSenderId: "480860155687",
  appId: "1:480860155687:web:99aeca974a7e7dc3614302",
  measurementId: "G-RL1L9B5RR0"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);
const analytics = getAnalytics(app); 
export { auth, googleProvider, db, analytics };
