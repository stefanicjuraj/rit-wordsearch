import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { useEffect, useState } from "react";
import { Message } from "../types/message";

export const sendMessage = async (
  message: unknown,
  uid: unknown,
  email: string,
  displayName: string
) => {
  const messagesDocRef = doc(db, "collection", "messages");

  const newMessage = {
    text: message,
    uid: uid,
    userEmail: email,
    timestamp: new Date(),
    displayName: displayName,
  };

  try {
    const docSnap = await getDoc(messagesDocRef);
    if (docSnap.exists()) {
      await setDoc(
        messagesDocRef,
        {
          messages: arrayUnion(newMessage),
        },
        { merge: true }
      );
    } else {
      await setDoc(messagesDocRef, {
        messages: [newMessage],
      });
    }
  } catch (error) {
    console.error("Error sending message: ", error);
    throw error;
  }
};

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const messagesDocRef = doc(db, "collection", "messages");
    const unsubscribe = onSnapshot(messagesDocRef, (doc) => {
      const data = doc.data();
      const msgs = data ? data.messages : [];
      msgs.sort(
        (a: { timestamp: unknown }, b: { timestamp: unknown }) =>
          (a.timestamp as number) - (b.timestamp as number)
      );
      setMessages(msgs as Message[]);
    });

    return () => unsubscribe();
  }, []);

  return messages;
};

export const getMessages = (setMessages: (arg0: unknown[]) => void) => {
  const messagesDocRef = doc(db, "collection", "messages");

  return onSnapshot(messagesDocRef, (doc) => {
    const data = doc.data();
    const msgs = data ? data.messages : [];
    msgs.sort(
      (a: { timestamp: number }, b: { timestamp: number }) =>
        a.timestamp - b.timestamp
    );
    setMessages(msgs);
  });
};
