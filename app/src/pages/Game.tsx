import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DocumentData, addDoc, collection, doc, runTransaction } from 'firebase/firestore';
// Services
import { db } from "../services/firebase";
// Types
import { User } from "../types/user";
// Hooks
import useGameRoom, { getUsersInGame, joinGameWithTransaction, leaveGame } from "../hooks/useGame";
import { auth } from '../hooks/auth';
// Components
import GameOver from "../components/GameOver";
import ScoreBoard from "../components/ScoreBoard";

export default function Game() {
    const [users, setUsers] = useState<DocumentData[]>([]);
    const [timer, setTimer] = useState(10);
    const [activePlayerIndex, setActivePlayerIndex] = useState(0);
    const [turnEnded, setTurnEnded] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const {
        currentSvgIndex,
        inputValue,
        alert,
        handleInputChange,
        handleSubmit,
        svgData,
        score
    } = useGameRoom();

    useEffect(() => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            joinGameWithTransaction(currentUser);
        }

        const unsubscribe = getUsersInGame((newUsers) => {
            setUsers(newUsers);
            if (newUsers.length === 2 && activePlayerIndex === 0) {
                setTimer(10);
                setTurnEnded(false);
            }
        });

        const countdown = setInterval(() => {
            if (!turnEnded) {
                setTimer(prevTimer => prevTimer > 0 ? prevTimer - 1 : 10);
            }
        }, 1000);

        return () => {
            if (currentUser) {
                leaveGame(currentUser.uid);
            }
            unsubscribe();
            clearInterval(countdown);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [turnEnded]);

    useEffect(() => {
        if (timer === 0 && users.length > 1) {
            const nextPlayerIndex = activePlayerIndex < users.length - 1 ? activePlayerIndex + 1 : 0;

            if (nextPlayerIndex === 0) {
                setTurnEnded(true);
            } else {
                setActivePlayerIndex(nextPlayerIndex);
                setTimer(10);
            }
        }
    }, [timer, users.length, activePlayerIndex]);

    useEffect(() => {
        if (turnEnded) {
            setGameOver(true);
            const gameRef = doc(db, "collection", "games");
            runTransaction(db, async (transaction) => {
                const gameDoc = await transaction.get(gameRef);
                if (!gameDoc.exists()) {
                    throw new Error("Error getting game database.");
                }
                const gameData = gameDoc.data();
                const updatedUsers = (gameData.users || []).map((user: { uid: string | undefined; score: unknown; }) => ({
                    ...user,
                    score: user.uid === auth.currentUser?.uid ? score : user.score
                }));
                transaction.update(gameRef, { users: updatedUsers });
            }).catch(() => console.error("Error updating the database."));
        }
    }, [turnEnded, users, score]);

    useEffect(() => {
        if (gameOver) {
            users.forEach(user => {
                if (user.score !== undefined) {
                    const scoresRef = collection(db, "scores");
                    addDoc(scoresRef, {
                        uid: user.uid,
                        score: user.score,
                    }).catch(() => {
                        console.error("Error writing score to database.");
                    });
                }
            });
        }
    }, [gameOver, users]);

    if (gameOver) {
        return (
            <>
                <GameOver />
                <ScoreBoard users={users as User[]} />
                <div className="text-center mt-32 mb-32">
                    <Link to="/" className="px-7 py-4 mt-32 text-sm font-medium text-white bg-red-500 border border-red-500 rounded-full focus:outline-none hover:bg-red-500 focus:ring-1 focus:ring-red-500 hover:text-black">
                        Exit
                    </Link>
                </div>
            </>
        );
    }


    return (
        <div>
            <h1 className="mt-20 text-white text-center mb-4">Players: {users.length}</h1>
            <div className="timer text-white text-center">
                Time left: {timer} seconds
            </div>
            <div className="mx-auto mt-8 text-center focus:ring-gray-900 focus:ring-1">
                {users[activePlayerIndex]?.uid === auth.currentUser?.uid ? (
                    <>
                        <img src={svgData[currentSvgIndex].src} className="mx-auto" alt="Game Image" />
                        <form onSubmit={(e) => { handleSubmit(e); if (currentSvgIndex === svgData.length - 1) { /* additional logic */ } }} className="mt-10">
                            <input className="rounded-xl p-4"
                                type="text"
                                value={inputValue}
                                onChange={handleInputChange}
                                placeholder="Enter found word"
                                autoComplete='off'
                            />
                            <button type="submit" className="block px-7 py-4 mx-auto mt-8 font-medium text-center text-white bg-green-500 hover:bg-green-500 rounded-full focus:ring-1 focus:outline-none focus:ring-green-500 text-md">Submit Word</button>
                        </form>
                        {alert.show && (
                            <div className={`p-4 mt-4 max-w-sm mx-auto mb-4 text-sm rounded-lg ${alert.type === 'success' ? 'text-green-800 bg-green-50' : 'text-red-800 bg-red-50'}`} role="alert">
                                {alert.message}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="max-w-sm mx-auto mb-32">
                        <hr className="my-8" />
                        <p className="text-white">
                            Waiting for your turn...
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}