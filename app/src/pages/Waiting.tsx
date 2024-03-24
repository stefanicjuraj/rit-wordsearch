import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DocumentData } from 'firebase/firestore';
// Hooks
import { getUsersInWaitingRoom, joinWaitingRoom, leaveWaitingRoom } from '../hooks/useWaitingRoom';
import { auth } from '../hooks/auth';
// Components
import Chat from '../components/Chat';

export default function Waiting() {
    const [players, setPlayers] = useState<DocumentData[]>([]);
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(30);

const intervalRef = useRef<NodeJS.Timeout | null>(null);

useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
        joinWaitingRoom(currentUser);
    }

    const unsubscribe = getUsersInWaitingRoom((newUsers) => {
        setPlayers(newUsers);

        if (newUsers.length === 2) {
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            setCountdown(30);
            intervalRef.current = setInterval(() => {
                setCountdown((currentCount) => {
                    if (currentCount <= 1) {
                        if (intervalRef.current) {
                            clearInterval(intervalRef.current);
                            intervalRef.current = null;
                        }
                        navigate('/game-room');
                        return currentCount;
                    }
                    return currentCount - 1;
                });
            }, 1000);
        } else if (newUsers.length < 2) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            setCountdown(30);
        }
    });

    return () => {
        if (currentUser) {
            leaveWaitingRoom(currentUser.uid);
        }
        unsubscribe();
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };
}, [navigate]);

    return (
        <div className="mx-auto mt-32 text-white">
            <h1 className="mb-8 text-xl text-center">
                You entered the waiting room!
            </h1>
            <h1 className="p-2 mb-2 text-xl text-center">
                Players in the waiting room: {players.length}
            </h1>
            {players.length === 2 &&
                <p className="text-center">
                    Game starts in: {countdown} seconds
                </p>
            }
            <ul className="text-center text-sm">
                {players.map((players, index) => (
                    <li key={index}>
                        <span className="text-green-500">•</span> {players.email}
                        {/* {user.joinedAt && new Date(user.joinedAt.seconds * 1000).toDateString()} */}
                    </li>
                ))}
            </ul>
            <Chat />
        </div>
    );
}
