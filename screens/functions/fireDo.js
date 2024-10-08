import { db } from '../../fireBaseConfig';  // Assuming firebaseConfig.js is your config file
import { doc, getDoc } from 'firebase/firestore';

const uploadData = async () => {
  try {
    await setDoc(doc(db, "RFID_Users", "60B737183"), {
      Name: "MinhVu",
      Alive: true,
      fullControl: true,
      daily: "6:00-5:59",
      setSchedule: {
        Fri: "6:00-5:59",
        Mon: "6:00-5:59",
        Sat: "6:00-5:59",
        Sun: "6:00-5:59",
        Thur: "6:00-5:59",
        Tue: "6:00-5:59",
        Wed: "6:00-5:59"
      }
    });
    console.log("Data successfully uploaded!");
  } catch (error) {
    console.error("Error uploading data: ", error);
  }
};



const updateData = async () => {
  try {
    const userRef = doc(db, "RFID_Users", "60B737183");
    await updateDoc(userRef, {
      fullControl: false  // Example update
    });
    console.log("Data successfully updated!");
  } catch (error) {
    console.error("Error updating data: ", error);
  }
};



const getData = async () => {
  const userRef = doc(db, "RFID_Users", "60B737183");

  try {
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      console.log("User data:", docSnap.data());
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error getting data: ", error);
  }
};

const deleteData = async () => {
  try {
    await deleteDoc(doc(db, "RFID_Users", "60B737183"));
    console.log("Data successfully deleted!");
  } catch (error) {
    console.error("Error deleting data: ", error);
  }
};