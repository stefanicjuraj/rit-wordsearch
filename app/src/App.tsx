import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { User, onAuthStateChanged } from "firebase/auth";
// Service
import { auth } from "./services/firebase"
// Components
import Navbar from "./components/Navbar";
import Game from "./pages/Game";
// Pages
import Login from "./pages/Login"
import Home from "./pages/Home";
import Waiting from "./pages/Waiting";
import Score from "./pages/Score";
import Latest from "./pages/Latest";

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
              <Route path="/waiting" element={<Waiting />} />
              <Route path="/game" element={<Game />} />
              <Route path="/score" element={<Score />} />
              <Route path="/latest" element={<Latest />} />
            </Routes>
          </>
        ) : (
          <Login />
        )}
      </>
    </Router >
  );
}
