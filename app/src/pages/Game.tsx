import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DocumentData, doc, getDoc, setDoc } from 'firebase/firestore';
// Hooks
import useGameRoom, { getUsersInGame, joinGame, leaveGame } from "../hooks/useGame";
import { auth } from '../hooks/auth';
import { db } from "../services/firebase";

export default function Game() {
    const [users, setUsers] = useState<DocumentData[]>([]);
    const [timer, setTimer] = useState(30);
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
            joinGame(currentUser);
        }

        const unsubscribe = getUsersInGame((newUsers) => {
            setUsers(newUsers);
        });

        const countdown = setInterval(() => {
            setTimer((prevTimer) => prevTimer - 1);
        }, 1000);

        return () => {
            if (currentUser) {
                leaveGame(currentUser.uid);
            }
            unsubscribe();
            clearInterval(countdown);
        };
    }, []);

    useEffect(() => {
        if (timer === 0) {
            const currentUser = auth.currentUser;
            if (currentUser) {
                const scoreRef = doc(db, "collection", "scores");

                getDoc(scoreRef).then((docSnap) => {
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        const userScores = data[currentUser.uid] || {};
                        let highestScore = userScores.highestScore || 0;

                        if (score > highestScore) {
                            highestScore = score;
                        }

                        const updatedScores = {
                            ...data,
                            [currentUser.uid]: {
                                displayName: currentUser.displayName,
                                email: currentUser.email,
                                score: score,
                                highestScore: highestScore
                            }
                        };

                        setDoc(scoreRef, updatedScores, { merge: true })
                            .then(() => {
                                window.alert(`Your score is ${score}.`);
                                navigate('/score');
                            })
                            .catch(error => {
                                console.error("Error saving score: ", error);
                                window.alert(`Your score is ${score}.`);
                                navigate('/score');
                            });
                    } else {
                        const initialScores = {
                            [currentUser.uid]: {
                                displayName: currentUser.displayName,
                                email: currentUser.email,
                                score: score,
                                highestScore: score
                            }
                        };

                        setDoc(scoreRef, initialScores, { merge: true })
                            .then(() => {
                                window.alert(`Your score is ${score}.`);
                                navigate('/score');
                            })
                            .catch(error => {
                                console.error("Error creating scores document: ", error);
                                window.alert(`Your score is ${score}.`);
                                navigate('/score');
                            });
                    }
                }).catch(error => {
                    console.error("Error fetching scores document: ", error);
                    window.alert(`Your score is ${score}.`);
                    navigate('/score');
                });
            } else {
                window.alert(`Your score is ${score}.`);
                navigate('/score');
            }
        }
    }, [timer, navigate, score]);

    return (
        <div>
            <h1 className="mt-20 text-white text-center mb-4">Players: {users.length} </h1>
            <div className="timer text-white text-center">
                Time left: {timer} seconds
            </div>
            <div className="mx-auto mt-8 text-center focus:ring-gray-900 focus:ring-1">
                <img src={svgData[currentSvgIndex].src} className="mx-auto" alt="Game Image" />
                <form onSubmit={(e) => { handleSubmit(e); if (currentSvgIndex === svgData.length - 1) { /* */ } }} className="mt-10">
                    <input className="rounded-xl p-4 rounded-xl"
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder="Enter found word"
                        autoComplete='off'
                    />
                    <button type="submit" className="block px-7 py-4 mx-auto mt-8 font-medium text-center text-white hover:text-black bg-green-500 hover:bg-green-500 rounded-full focus:ring-1 focus:outline-none focus:ring-green-500 text-md">Submit Word</button>
                </form>
                {alert.show && (
                    <div className={`p-4 mt-4 max-w-sm mx-auto mb-4 text-sm rounded-lg ${alert.type === 'success' ? 'text-green-800 bg-green-50' : 'text-red-800 bg-red-50'}`} role="alert">
                        <span className="font-medium">
                            {alert.type === 'success' ? '' : ''}
                        </span>
                        {alert.message}
                    </div>
                )}
            </div>
            <div className="mt-12 text-center mb-32">
                <Link to="/" className="px-7 py-4 text-sm font-medium text-white bg-red-500 border border-red-500 rounded-full focus:outline-none hover:bg-red-500 focus:ring-1 focus:ring-red-500 hover:text-black me-2">
                    Exit Game
                </Link>
            </div>
        </div>
    );
}