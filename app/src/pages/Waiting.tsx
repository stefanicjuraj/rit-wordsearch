import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DocumentData } from 'firebase/firestore';
// Hooks
import { getUsersinWaiting, joinWaiting, leaveWaiting, updatePlayerReadyStatus } from '../hooks/useWaiting';
import { auth } from '../hooks/auth';
// Components
import Chat from '../components/Chat';

export default function Waiting() {
    const [players, setPlayers] = useState<DocumentData[]>([]);
    const navigate = useNavigate();
    const currentUser = auth.currentUser;

    useEffect(() => {
        if (currentUser) {
            joinWaiting(currentUser);
        }

        const unsubscribe = getUsersinWaiting((newUsers) => {
            setPlayers(newUsers);

            if ((newUsers as DocumentData[]).length === 2 && (newUsers as DocumentData[]).every(user => user.ready)) {
                navigate('/game');
            }
        });

        return () => {
            if (currentUser) {
                leaveWaiting(currentUser.uid);
            }
            unsubscribe();
        };
    }, [navigate, currentUser]);

    const handlePlayerReady = () => {
        if (currentUser) {
            const userId = currentUser.uid || '';
            updatePlayerReadyStatus(userId);
        }
    };

    return (
        <div className="mx-auto mt-32 text-white">
            <h1 className="p-2 mb-2 text-xl text-center">
                Players in the waiting room: {players.length}
            </h1>
            <ul className="text-center text-sm">
                {players.map((player, index) => (
                    <li key={index}>
                        <span className="text-green-500">•</span> {player.email} - {player.ready ? "Ready" : "Not Ready"}
                    </li>
                ))}
            </ul>
            <div className="text-center my-8">
                <button
                    className="px-7 py-4 text-sm font-medium text-white bg-green-500 border border-green-500 rounded-full focus:outline-none hover:bg-green-500 focus:ring-1 focus:ring-green-500 hover:text-black"
                    onClick={handlePlayerReady}
                >
                    Ready
                </button>
            </div>
            {players.length === 2 && (
                <p className="text-center mb-4">
                    Waiting for both players to be ready...
                </p>
            )}
            <Chat />
            <div className="text-center mb-32">
                <Link to="/" className="px-7 py-4 text-sm font-medium text-white bg-red-500 border border-red-500 rounded-full focus:outline-none hover:bg-red-500 focus:ring-1 focus:ring-red-500 hover:text-black">
                    Exit Waiting Room
                </Link>
            </div>
        </div>
    );
}