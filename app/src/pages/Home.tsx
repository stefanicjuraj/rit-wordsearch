import { Link } from "react-router-dom";
// Components
import LogOut from "../components/Logout";
// Icons
import image from "/assets/it-wordsearch.svg";

export default function Home() {
    return (
        <>
            <div className="mx-auto mt-24 mb-24 text-center text-white max-w-screen-md">
                <h1 className="mb-4 text-2xl font-bold text-center">Welcome to IT WordSearch Game</h1>
                <div className="mb-8 text-center">
                    <p className="p-8 text-md text-left rounded-xl">
                        Find hidden IT-related words in a grid of letters. The words can be placed vertically, horizontally, or diagonally, and in both forward and backward orientations.
                    </p>
                </div>
                <div className="">
                    <img src={image} alt="IT wordsearch" className="mx-auto w-2/4" />
                </div>
                <div className="mt-8 mb-16 text-center">
                    <p className="text-md font-bold">
                        Start by entering the waiting room and wait for your opponent to join.
                    </p>
                </div>

                <div className="mb-12">
                    <Link to="/waiting-room" className="px-7 py-4 text-sm font-medium text-white bg-green-500 border border-green-500 rounded-full focus:outline-none hover:bg-green-500 focus:ring-1 focus:ring-green-500 hover:text-black me-2">
                        Enter Waiting Room
                    </Link>
                </div>

                <div className="mt-12">
                    <Link to="/score" className="px-7 py-4 text-sm font-medium text-white bg-yellow-500 border border-yellow-500 rounded-full focus:outline-none hover:bg-yellow-500 focus:ring-1 focus:ring-yellow-500 hover:text-black me-2">
                        View Scoreboard
                    </Link>
                </div>

                <LogOut />

            </div>
        </>
    )
}
