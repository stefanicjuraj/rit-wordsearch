import { SetStateAction, useState } from "react";
import { db } from "../services/firebase";
import {
  DocumentData,
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  runTransaction,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { User } from "firebase/auth";

export const joinGameRoom = async (user: User) => {
  const gameRoomRef = doc(db, "collection", "games");
  const snapshot = await getDoc(gameRoomRef);
  if (snapshot.exists()) {
    const players = snapshot.data().players || [];
    const playerExists = players.some(
      (existingPlayer: { uid: unknown }) => existingPlayer.uid === user.uid
    );
    if (!playerExists) {
      await updateDoc(gameRoomRef, {
        players: arrayUnion({
          gameId: new Date(),
          uid: user.uid,
          email: user.email,
          joinedAt: new Date(),
        }),
      });
    }
  } else {
    await setDoc(gameRoomRef, {
      players: [
        {
          gameId: new Date(),
          uid: user.uid,
          email: user.email,
          joinedAt: new Date(),
        },
      ],
    });
  }
};

export const leaveGameRoom = async (uid: string) => {
  const gameRoomRef = doc(db, "collection", "games");

  try {
    await runTransaction(db, async (transaction) => {
      const gameRoomDoc = await transaction.get(gameRoomRef);
      if (!gameRoomDoc.exists()) {
        throw "Document does not exist!";
      }
      const gameRoomData = gameRoomDoc.data();
      const updatedPlayers = gameRoomData.players.filter(
        (player: { uid: string }) => player.uid !== uid
      );

      transaction.update(gameRoomRef, { players: updatedPlayers });
    });
  } catch (e) {
    console.log("Transaction failed: ", e);
  }
};

export const getUsersInGameRoom = (setUsers: {
  (value: SetStateAction<DocumentData[]>): void;
  (arg0: never[]): void;
}) => {
  const gameRoomRef = doc(db, "collection", "games");

  return onSnapshot(gameRoomRef, (doc) => {
    if (doc.exists()) {
      const data = doc.data();
      setUsers(data.players || []);
    } else {
      setUsers([]);
    }
  });
};

export default function useGameRoom(initialSvgIndex = 0) {
  const [currentSvgIndex, setCurrentSvgIndex] = useState(initialSvgIndex);
  const [inputValue, setInputValue] = useState("");
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [currentPlayer, setCurrentPlayer] = useState(1);

  const svgData = [
    { src: "class.svg", correctAnswer: "class" },
    { src: "function.svg", correctAnswer: "function" },
    { src: "program.svg", correctAnswer: "program" },
  ];

  const handleInputChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (
      inputValue.toLowerCase() ===
      svgData[currentSvgIndex].correctAnswer.toLowerCase()
    ) {
      const nextIndex = (currentSvgIndex + 1) % svgData.length;
      setCurrentSvgIndex(nextIndex);

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
  };
}
