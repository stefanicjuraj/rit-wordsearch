import { useEffect, useState } from 'react';
import { getUsersInWaitingRoom, joinWaitingRoom, leaveWaitingRoom } from '../hooks/useWaitingRoom';
import { auth } from '../hooks/auth';
import { DocumentData } from 'firebase/firestore';
import Chat from '../components/Chat';
import { useNavigate } from 'react-router-dom';

export default function WaitingRoom() {
    const [players, setPlayers] = useState<DocumentData[]>([]);
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(30);

    useEffect(() => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            joinWaitingRoom(currentUser);
        }

        const unsubscribe = getUsersInWaitingRoom((newUsers) => {
            setPlayers(newUsers);
            if (newUsers.length === 2) {
                setCountdown(30);
                const interval = setInterval(() => {
                    setCountdown((currentCount) => {
                        if (currentCount <= 1) {
                            clearInterval(interval);
                            navigate('/game-room');
                            return currentCount;
                        }
                        return currentCount - 1;
                    });
                }, 1000);
                return () => clearInterval(interval);
            }
        });

        return () => {
            if (currentUser) {
                leaveWaitingRoom(currentUser.uid);
            }
            unsubscribe();
        };
    }, [navigate]);

    return (
        <div className="mx-auto mt-32 text-white">
            <h1 className="mb-8 text-3xl text-center">
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
            <ul className="text-center">
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
