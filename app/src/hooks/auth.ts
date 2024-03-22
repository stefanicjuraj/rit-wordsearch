import { doc, getDoc, setDoc } from "firebase/firestore";
// Auth
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  User,
} from "firebase/auth";
// Services
import { auth, db } from "../services/firebase";

export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    await addUserToDatabase(userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error("Error in Google sign-in: ", error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    await addUserToDatabase(userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error("Error in user login: ", error);
    throw error;
  }
};

export const addUserToDatabase = async (firebaseUser: User) => {
  const userData = {
    email: firebaseUser.email,
    username: firebaseUser.displayName || firebaseUser.email,
    lastLogin: new Date().toISOString(),
  };

  if (userData.email === null) {
    throw new Error("User email is null");
  }

  try {
    const usersDocRef = doc(db, "collection", "users");

    let users = [];
    const usersSnapshot = await getDoc(usersDocRef);
    if (usersSnapshot.exists()) {
      users = usersSnapshot.data().users || [];
    }

    users.push(userData);

    await setDoc(usersDocRef, { users }, { merge: true });
  } catch (error) {
    console.error("Error adding user to database: ", error);
    throw error;
  }
};

export { auth };
