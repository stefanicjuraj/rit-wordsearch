import { SetStateAction } from "react";
import { User } from "firebase/auth";
import {
  DocumentData,
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
// Services
import { db } from "../services/firebase";

export const joinWaitingRoom = async (user: User) => {
  const waitingRoomRef = doc(db, "collection", "waiting");
  const snapshot = await getDoc(waitingRoomRef);
  if (snapshot.exists()) {
    const users = snapshot.data().users || [];
    const userExists = users.some(
      (existingUser: { uid: unknown }) => existingUser.uid === user.uid
    );
    if (!userExists) {
      await updateDoc(waitingRoomRef, {
        users: arrayUnion({
          uid: user.uid,
          email: user.email,
          joinedAt: new Date(),
        }),
      });
    }
  } else {
    await setDoc(waitingRoomRef, {
      users: [
        {
          uid: user.uid,
          email: user.email,
          joinedAt: new Date(),
        },
      ],
    });
  }
};

export const leaveWaitingRoom = async (uid: string) => {
  const waitingRoomRef = doc(db, "collection", "waiting");
  const snapshot = await getDoc(waitingRoomRef);
  if (snapshot.exists() && snapshot.data().users) {
    const waitingRoomData = snapshot.data();
    const updatedUsers = waitingRoomData.users.filter(
      (user: { uid: string }) => user.uid !== uid
    );

    await updateDoc(waitingRoomRef, { users: updatedUsers });

    if (updatedUsers.length === 0) {
      clearChatMessages();
    }
  }
};

const clearChatMessages = async () => {
  const messagesDocRef = doc(db, "collection", "messages");
  await setDoc(messagesDocRef, { messages: [] });
};


export const getUsersInWaitingRoom = (setUsers: {
  (value: SetStateAction<DocumentData[]>): void;
  (arg0: never[]): void;
}) => {
  const waitingRoomRef = doc(db, "collection", "waiting");

  return onSnapshot(waitingRoomRef, (doc) => {
    if (doc.exists()) {
      const data = doc.data();
      setUsers(data.users || []);
    } else {
      setUsers([]);
    }
  });
};
