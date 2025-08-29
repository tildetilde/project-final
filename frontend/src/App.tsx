import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { Home } from "./pages/Home";
import GameMode from "./pages/GameMode";
import AdminPage from "./pages/AdminPage";

export const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gamemode" element={<GameMode />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
};
