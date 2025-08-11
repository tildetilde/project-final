import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { GameMode } from './pages/GameMode';
import { Login } from './pages/Login';

export const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gamemode" element={<GameMode />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};
