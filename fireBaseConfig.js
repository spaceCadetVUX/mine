  import { initializeApp } from 'firebase/app';
  import { getFirestore , doc, setDoc, updateDoc, deleteDoc} from 'firebase/firestore';
  import { getAuth ,initializeAuth, getReactNativePersistence } from 'firebase/auth';
  import AsyncStorage from '@react-native-async-storage/async-storage';

  const firebaseConfig = {
    apiKey: "AIzaSyAoZ-COEy0AGqR-UAFBQ2T-OK0YJJ2ey_I",
    authDomain: "locker-ee987.firebaseapp.com",
    projectId: "locker-ee987",
    storageBucket: "locker-ee987.appspot.com",
    messagingSenderId: "828769365556",
    appId: "1:828769365556:web:3950096f85886e23d06461"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize Auth with AsyncStorage for persistence
  const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
  const db = getFirestore(app);

  export { db,app, auth };
