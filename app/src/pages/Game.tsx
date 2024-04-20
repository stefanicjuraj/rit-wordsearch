import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DocumentData, doc, getDoc, setDoc } from 'firebase/firestore';
// Hooks
import useGameRoom, { getUsersInGame, joinGameWithTransaction, leaveGame } from "../hooks/useGame";
import { auth } from '../hooks/auth';
import { db } from "../services/firebase";

export default function Game() {
    const [users, setUsers] = useState<DocumentData[]>([]);
    const [timer, setTimer] = useState(10);
    const [activePlayerIndex, setActivePlayerIndex] = useState(0);
    const [turnEnded, setTurnEnded] = useState(false);
    const navigate = useNavigate();
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
            users.forEach(user => {
                const scoreRef = doc(db, "collection", "scores");

                getDoc(scoreRef).then((docSnap) => {
                    const data = docSnap.data() || {};
                    const userScores = data[user.uid] || {};
                    const highestScore = Math.max(userScores.highestScore || 0, score);

                    const updatedScores = {
                        ...data,
                        [user.uid]: {
                            displayName: user.displayName,
                            email: user.email,
                            score: score,
                            highestScore: highestScore
                        }
                    };

                    setDoc(scoreRef, updatedScores, { merge: true }).catch(error => {
                        console.error("Error updating scores document: ", error);
                    });
                }).catch(error => {
                    console.error("Error fetching scores document: ", error);
                });
            });
            navigate('/score');
        }
    }, [turnEnded, users, navigate, score]);


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
            <div className="mt-12 text-center mb-32">
                <Link to="/" className="px-7 py-4 text-sm font-medium text-white bg-red-500 rounded-full focus:outline-none hover:bg-red-500 focus:ring-1 focus:ring-red-500 hover:text-black me-2">
                    Exit Game
                </Link>
            </div>
        </div>
    );
}