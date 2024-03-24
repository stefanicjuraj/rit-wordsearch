import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
// Services
import { db } from "../services/firebase";
// Types
import { UserScore } from '../types/score';

export default function Score() {
    const [scores, setScores] = useState<UserScore[]>([]);

    useEffect(() => {
        const fetchScores = async () => {
            const scoreRef = doc(db, "collection", "scores");

            const docSnap = await getDoc(scoreRef);
            if (docSnap.exists()) {
                const scoresData = docSnap.data();

                const scoresArray: UserScore[] = Object.entries(scoresData).map(([, userScores]: [string, unknown]) => {
                    return {
                        displayName: (userScores as UserScore).displayName || 'Unknown',
                        highestScore: (userScores as UserScore).highestScore || 0
                    };
                });

                scoresArray.sort((a, b) => b.highestScore - a.highestScore);
                setScores(scoresArray);
            } else {
                console.log("No scores found!");
            }
        };

        fetchScores().catch(console.error);
    }, []);

    return (

        <>
            <div className="mx-auto mt-24 mb-16 text-center text-white max-w-screen-md">
                <h1 className="mb-4 text-2xl font-bold text-center">Scoreboard</h1>
            </div>
            <div className="relative overflow-x-auto max-w-screen-sm mx-auto rounded-xl">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                    <thead className="text-sm text-white uppercase bg-green-500">
                        <tr>
                            <th scope="col" className="px-6 py-7">
                                Player
                            </th>
                            <th scope="col" className="px-6 py-7">
                                Highest Score
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {scores.map((user, index) => (
                            <tr key={index} className="bg-white border-b">
                                <th scope="row" className="px-6 py-5 font-medium text-black whitespace-nowrap">
                                    {user.displayName}
                                </th>
                                <td className="px-6 py-4 text-black">
                                    {user.highestScore}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
