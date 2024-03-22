import { logoutUser } from "../hooks/auth";

export default function LogOut() {
    const handleSignOut = async () => {
        try {
            await logoutUser();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <button onClick={handleSignOut} className="block mx-auto mt-16 mb-16 px-7 py-2 text-sm font-normal text-center text-black bg-white rounded-full hover:bg-red-500 focus:ring-4 focus:outline-none focus:ring-blue-300 text-md">
            Log Out
        </button>
    );
}
