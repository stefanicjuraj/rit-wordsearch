import { useEffect, useState } from "react";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
// Services
import { db } from "../services/firebase";
// Types
import { Message } from "../types/message";
// Utils
import { sanitizeInput } from "../utils/sanitization";

export const sendMessage = async (
  message: unknown,
  uid: unknown,
  email: string,
  displayName: string
) => {
  const messagesDocRef = doc(db, "collection", "messages");

  const {
    message: sanitizeMessage,
    uid: sanitizeUid,
    email: sanitizedEmail,
    displayName: sanitizeDisplayName,
  } = sanitizeInput({
    message: message as string,
    uid: uid as string,
    email,
    displayName: displayName as string,
  });

  const newMessage = {
    text: sanitizeMessage,
    uid: sanitizeUid,
    userEmail: sanitizedEmail,
    timestamp: new Date(),
    displayName: sanitizeDisplayName,
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
    console.error("Error sending message.");
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
