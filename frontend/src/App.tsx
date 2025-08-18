import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Home } from "./pages/Home";
import GameMode from "./pages/GameMode";

export const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gamemode" element={<GameMode />} />
      </Routes>
    </Router>
  );
};
