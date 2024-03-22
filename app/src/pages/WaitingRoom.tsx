import { useEffect, useState } from 'react';
import { getUsersInWaitingRoom, joinWaitingRoom, leaveWaitingRoom } from '../hooks/useWaitingRoom';
import { auth } from '../hooks/auth';
import { DocumentData } from 'firebase/firestore';
import Chat from '../components/Chat';
import { useNavigate } from 'react-router-dom';

export default function WaitingRoom() {
    const [users, setUsers] = useState<DocumentData[]>([]);
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(30);

    useEffect(() => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            joinWaitingRoom(currentUser);
        }

        const unsubscribe = getUsersInWaitingRoom((newUsers) => {
            setUsers(newUsers);
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
                Users in the waiting room: {users.length}
            </h1>
            <ul className="text-center">
                {users.map((user, index) => (
                    <li key={index}>
                        {user.email} - Joined:
                        {user.joinedAt && new Date(user.joinedAt.seconds * 1000).toDateString()}
                    </li>
                ))}
            </ul>
            <Chat />
            {users.length === 2 && <h2>Game starts in: {countdown} seconds</h2>}
        </div>
    );
}
