export default function Navbar() {
    return (
        <>
            <nav className="bg-[#111] text-white fixed w-full z-20 top-0 start-0 py-2">
                <div className="flex flex-wrap items-center justify-between p-5 mx-auto max-w-screen-xl">
                    <a className="flex items-center space-x-3 rtl:space-x-reverse">
                        <span className="self-center text-3xl font-black whitespace-nowrap">
                            IT WordSearch
                        </span>
                    </a>
                    <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                    </div>
                    <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
                        <ul className="flex flex-col p-4 mt-4 text-lg font-bold border border-gray-100 rounded-lg md:p-0 bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white">
                            <li>
                                <a href="#" className="block px-3 py-2 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0"></a>
                            </li>
                            <li>
                                <a href="#" className="block px-3 py-2 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0"></a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

        </>
    );
}
