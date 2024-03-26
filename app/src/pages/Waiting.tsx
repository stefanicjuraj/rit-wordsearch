import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DocumentData } from 'firebase/firestore';
// Hooks
import { getUsersinWaiting, joinWaiting, leaveWaiting } from '../hooks/useWaiting';
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
            joinWaiting(currentUser);
        }

        const unsubscribe = getUsersinWaiting((newUsers) => {
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
                            navigate('/game');
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
                leaveWaiting(currentUser.uid);
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
            <div className="text-center mb-32">
                <Link to="/" className="px-7 py-4 text-sm font-medium text-white bg-red-500 border border-red-500 rounded-full focus:outline-none hover:bg-red-500 focus:ring-1 focus:ring-red-500 hover:text-black me-2">
                    Exit Waiting Room
                </Link>
            </div>
        </div>
    );
}
