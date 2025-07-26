import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCxqQDcAIY28mj3KVPiBBOLwNLTi5lLRKE",
  authDomain: "hhhh-1c48d.firebaseapp.com",
  projectId: "hhhh-1c48d",
  storageBucket: "hhhh-1c48d.firebasestorage.app",
  messagingSenderId: "884366665443",
  appId: "1:884366665443:web:213ca6c3db1fcf541447d6",
  measurementId: "G-59YBVVW5L3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;