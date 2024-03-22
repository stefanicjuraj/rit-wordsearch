import { Link } from "react-router-dom";
import image from "/public/it-wordsearch.svg";
import LogOut from "../components/Logout";

export default function Home() {
    return (
        <>
            <div className="mx-auto mt-24 mb-24 text-center text-white max-w-screen-sm">
                <h1 className="mb-4 text-2xl font-bold text-center">Welcome to IT WordSearch Game</h1>
                <div className="mb-8 text-center">
                    <p className="p-8 text-md text-left rounded-xl">
                        Find hidden IT-related words in a grid of letters. The words can be placed vertically, horizontally, or diagonally, and in both forward and backward orientations.
                    </p>
                </div>
                <div className="">
                    <img src={image} alt="IT wordsearch" className="mx-auto w-2/4" />
                </div>
                <div className="mt-8 mb-8 text-center">
                    <p className="text-md font-bold">
                        Start by entering the waiting room and wait for your opponent to join.
                    </p>
                </div>

                <Link to="/waiting-room" className="px-7 py-3 mt-10 mb-2 text-sm font-medium text-gray-900 bg-white border border-gray-500 rounded-full focus:outline-none hover:bg-green-500 focus:ring-4 focus:ring-gray-100 me-2">
                    Enter Waiting Room
                </Link>

                <LogOut />

            </div>
        </>
    )
}
