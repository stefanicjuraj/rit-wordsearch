// Hooks
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
        <button onClick={handleSignOut} className="block mx-auto mt-16 mb-16 px-7 py-3 text-sm font-normal text-center text-white hover:text-black bg-red-500 rounded-full hover:bg-red-500 focus:ring-2 focus:outline-none focus:ring-blue-300 text-md">
            Log Out
        </button>
    );
}
