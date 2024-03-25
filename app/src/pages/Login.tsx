// Hooks
import { signInWithGoogle } from '../hooks/auth';
// Icons
import image from "/assets/it-wordsearch.svg";

export default function Login() {

    const loginGoogle = async () => {
        try {
            const user = await signInWithGoogle();
            console.log('Logged in user:', user);
        } catch (error) {
            console.error("Google login failed: ", error);
        }
    };

    return (
        <div className="mx-auto mt-24 mb-24 text-center text-white max-w-screen-md">
            <h1 className="mb-4 text-2xl font-bold text-center">Welcome to IT WordSearch Game</h1>
            <div className="mb-8 text-center">
                <p className="p-8 text-md font-normal text-left rounded-xl">
                    Find hidden IT-related words in a grid of letters. The words can be placed vertically, horizontally, or diagonally, and in both forward and backward orientations.
                </p>
            </div>
            <img src={image} alt="IT wordsearch" className="mx-auto w-2/5" />
            <div className="mt-8 mb-8 text-center">
                <p className="text-md font-bold">
                    Log in with your Google account to play the game.
                </p>
            </div>
            <button
                type="button"
                className="text-white bg-green-500 hover:bg-green-500 hover:text-black focus:ring-1 focus:outline-none focus:ring-green-500 font-normal rounded-full text-sm w-full sm:w-auto px-7 py-3"
                onClick={loginGoogle}>
                Login with Google
            </button>
        </div>
    );
}
