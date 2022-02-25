import './App.css';
import GameOne from './pages/GameOne';
import MainMenu from './pages/MainMenu';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const RouterSwitch = () => {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/game/:id" element={<GameOne />} />
      </Routes>
    </BrowserRouter>
  );
}

export default RouterSwitch;
