import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DocumentData, doc, setDoc } from 'firebase/firestore';
// Hooks
import useGameRoom, { getUsersInGameRoom, joinGameRoom, leaveGameRoom } from "../hooks/useGameRoom";
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
            joinGameRoom(currentUser);
        }

        const unsubscribe = getUsersInGameRoom((newUsers) => {
            setUsers(newUsers);
        });

        const countdown = setInterval(() => {
            setTimer((prevTimer) => prevTimer - 1);
        }, 1000);

        return () => {
            if (currentUser) {
                leaveGameRoom(currentUser.uid);
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
                const userScore = `${currentUser.uid}`;
                setDoc(scoreRef, {
                    [userScore]: {
                        displayName: currentUser.displayName,
                        email: currentUser.email,
                        score: score,
                    }
                }, { merge: true })
                    .then(() => {
                        navigate('/');
                    })
                    .catch(error => {
                        console.error("Error saving score: ", error);
                        navigate('/');
                    });
            } else {
                navigate('/');
            }
        }
    }, [timer, navigate, score]);

    return (
        <div>
            <h1 className="mt-20 text-white text-center mb-4">Players: {users.length} </h1>
            <div className="timer text-white text-center">
                Time left: {timer} seconds
            </div>
            <div className="mx-auto mt-8 text-center">
                <img src={svgData[currentSvgIndex].src} className="mx-auto" alt="Word Search Game" />
                <form onSubmit={(e) => { handleSubmit(e); if (currentSvgIndex === svgData.length - 1) { /* */ } }} className="mt-10">
                    <input className="rounded-xl"
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder="Enter found word"
                        autoComplete='off'
                    />
                    <button type="submit" className="block px-5 py-3 mx-auto mt-5 font-medium text-center text-white bg-black rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 text-md">Submit Word</button>
                </form>
                {alert.show && (
                    <div className={`p-4 mt-4 max-w-sm mx-auto mb-4 text-sm rounded-lg ${alert.type === 'success' ? 'text-green-800 bg-green-50' : 'text-red-800 bg-red-50'}`} role="alert">
                        <span className="font-medium">
                            {alert.type === 'success' ? 'Success!' : 'Error!'}
                        </span>
                        {alert.message}
                    </div>
                )}
            </div>
        </div>
    );
}