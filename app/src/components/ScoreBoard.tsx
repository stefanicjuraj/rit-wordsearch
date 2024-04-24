import { User } from "../types/user";

const ScoreBoard = ({ users }: { users: User[] }) => {
    return (
        <>
            <h3 className="text-lg text-center mb-8 mt-16 text-green-500">Score Board</h3>
            <div className="relative overflow-x-auto max-w-screen-sm mx-auto rounded-xl">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                    <thead className="text-sm text-white uppercase bg-green-500">
                        <tr>
                            <th scope="col" className="px-6 py-7">
                                Player
                            </th>
                            <th scope="col" className="px-6 py-7">
                                Score
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={index} className="bg-white border-b">
                                <th scope="row" className="px-6 py-5 font-medium text-black whitespace-nowrap">
                                    {user.email}
                                </th>
                                <td className="px-6 py-4 text-black">
                                    {user.score}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default ScoreBoard;