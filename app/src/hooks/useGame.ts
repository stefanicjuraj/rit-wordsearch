import { SetStateAction, useState } from "react";
import {
  DocumentData,
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { User } from "firebase/auth";
// Services
import { db } from "../services/firebase";
// Utils
import { sanitizeString } from "../utils/sanitization";

export const joinGame = async (user: User) => {
  const gameRoomRef = doc(db, "collection", "games");
  const snapshot = await getDoc(gameRoomRef);
  if (snapshot.exists()) {
    const users = snapshot.data().users || [];
    const userExists = users.some(
      (existingUser: { uid: unknown }) => existingUser.uid === user.uid
    );
    if (!userExists) {
      await updateDoc(gameRoomRef, {
        users: arrayUnion({
          uid: user.uid,
          email: user.email,
        }),
      });
    }
  } else {
    await setDoc(gameRoomRef, {
      users: [
        {
          uid: user.uid,
          email: user.email,
        },
      ],
    });
  }
};

export const leaveGame = async (uid: string) => {
  const gameRoomRef = doc(db, "collection", "games");
  const snapshot = await getDoc(gameRoomRef);
  if (snapshot.exists()) {
    const gameRoomData = snapshot.data();
    if (gameRoomData.users) {
      const updatedUsers = gameRoomData.users.filter(
        (user: { uid: string }) => user.uid !== uid
      );
      await updateDoc(gameRoomRef, { users: updatedUsers });
    }
  }
};

export const getUsersInGame = (setUsers: {
  (value: SetStateAction<DocumentData[]>): void;
  (arg0: never[]): void;
}) => {
  const waitingRoomRef = doc(db, "collection", "games");

  return onSnapshot(waitingRoomRef, (doc) => {
    if (doc.exists()) {
      const data = doc.data();
      setUsers(data.users || []);
    } else {
      setUsers([]);
    }
  });
};

export default function useGame(initialSvgIndex = 0) {
  const [currentSvgIndex, setCurrentSvgIndex] = useState(initialSvgIndex);
  const [inputValue, setInputValue] = useState("");
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [score, setScore] = useState(0);

  const svgData = [
    { src: "class.svg", correctAnswer: "class" },
    { src: "function.svg", correctAnswer: "function" },
    { src: "program.svg", correctAnswer: "program" },
  ];

  const handleInputChange = (event: { target: { value: string } }) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();

    const sanitizedInputValue = sanitizeString(inputValue).toLowerCase();

    if (
      sanitizedInputValue ===
      svgData[currentSvgIndex].correctAnswer.toLowerCase()
    ) {
      const nextIndex = (currentSvgIndex + 1) % svgData.length;
      setCurrentSvgIndex(nextIndex);

      setScore((prevScore) => prevScore + 1);

      setAlert({
        show: true,
        message: "Correct! Moving to the next one.",
        type: "success",
      });
    } else {
      setAlert({
        show: true,
        message: "Incorrect. Try again.",
        type: "error",
      });
    }
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 2000);
    setInputValue("");
  };

  return {
    currentSvgIndex,
    inputValue,
    alert,
    handleInputChange,
    handleSubmit,
    svgData,
    currentPlayer,
    setCurrentPlayer,
    score,
  };
}