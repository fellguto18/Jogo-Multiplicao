import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import GameArea from './pages/GameArea';
import PainelProf from './pages/PainelProf';
import Register from './pages/Register';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registo" element={<Register />} />
        <Route path="/jogo" element={<GameArea />} />
        <Route path="/painel" element={<PainelProf />} />
      </Routes>
    </BrowserRouter>
  );
}