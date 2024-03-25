import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
// Services
import { db } from "../services/firebase";
// Types
import { LatestScore } from '../types/latest';
import { Link } from 'react-router-dom';

export default function Latest() {
    const [latest, setLatest] = useState<LatestScore[]>([]);

    useEffect(() => {
        const fetchScores = async () => {
            const scoreRef = doc(db, "collection", "scores");

            const docSnap = await getDoc(scoreRef);
            if (docSnap.exists()) {
                const scoresData = docSnap.data();

                const scoresArray: LatestScore[] = Object.entries(scoresData).map(([, userScores]: [string, unknown]) => {
                    return {
                        displayName: (userScores as LatestScore).displayName || 'Unknown',
                        score: (userScores as LatestScore).score || 0
                    };
                });

                scoresArray.sort((a, b) => b.score - a.score);
                setLatest(scoresArray);
            } else {
                console.log("No scores found!");
            }
        };

        fetchScores().catch(console.error);
    }, []);

    return (

        <>
            <div className="mx-auto mt-24 mb-16 text-center text-white max-w-screen-md">
                <h1 className="mb-4 text-2xl font-bold text-center">Latest Game Scores</h1>
            </div>
            <div className="relative overflow-x-auto max-w-screen-sm mx-auto rounded-xl">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                    <thead className="text-sm text-white uppercase bg-green-500">
                        <tr>
                            <th scope="col" className="px-6 py-7">
                                Player
                            </th>
                            <th scope="col" className="px-6 py-7">
                                Latest Score
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {latest.map((user, index) => (
                            <tr key={index} className="bg-white border-b">
                                <th scope="row" className="px-6 py-5 font-medium text-black whitespace-nowrap">
                                    {user.displayName}
                                </th>
                                <td className="px-6 py-4 text-black">
                                    {user.score}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-12 text-center mb-12">
                <Link to="/score" className="px-7 py-4 text-sm font-medium text-white bg-yellow-500 border border-yellow-500 rounded-full focus:outline-none hover:bg-yellow-500 focus:ring-1 focus:ring-yellow-500 hover:text-black me-2">
                    Highest Scores
                </Link>
            </div>
            <div className="mt-12 text-center mb-32">
                <Link to="/" className="px-7 py-4 text-sm font-medium text-white bg-red-500 border border-red-500 rounded-full focus:outline-none hover:bg-red-500 focus:ring-1 focus:ring-red-500 hover:text-black me-2">
                    Exit
                </Link>
            </div>
        </>
    );
}
