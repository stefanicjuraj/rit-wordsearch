import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { User, onAuthStateChanged } from "firebase/auth";
// Service
import { auth } from "./services/firebase"
// Components
import Navbar from "./components/Navbar";
import GameRoom from "./pages/GameRoom";
// Pages
import Login from "./pages/Login"
import Home from "./pages/Home";
import WaitingRoom from "./pages/WaitingRoom";

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <Router>
      <>
        {currentUser ? (
          <>
            <Navbar />
            <p> Welcome, {currentUser.email}</p>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/waiting-room" element={<WaitingRoom />} />
              <Route path="/game-room" element={<GameRoom />} />
            </Routes>
          </>
        ) : (
          <Login />
        )}
      </>
    </Router >
  );
}
