import { useState } from 'react';
// Hooks
import { loginUser, signInWithGoogle } from '../hooks/auth';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const user = await loginUser(email, password);
            console.log('Logged in user:', user);
        } catch (error) {
            console.error("Login failed: ", error);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const user = await signInWithGoogle();
            console.log('Logged in user:', user);
        } catch (error) {
            console.error("Google login failed: ", error);
        }
    };

    return (
        <div className="mx-auto mt-20 max-w-screen-sm">
            <div className="mb-5">
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                <input type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="name@flowbite.com" required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="mb-5">
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
                <input type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                onClick={handleLogin}>
                Submit
            </button>


            <button
                type="button"
                className="mt-4 text-white bg-red-500 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                onClick={handleGoogleLogin}>
                Login with Google
            </button>
        </div>
    );
}
