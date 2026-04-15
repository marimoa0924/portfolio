import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ModeProvider } from './context/ModeContext';
import ModeSelector from './components/ModeSelector';
import DeveloperPage from './pages/DeveloperPage';
import CreatorPage from './pages/CreatorPage';

export default function App() {
  return (
    <BrowserRouter>
      <ModeProvider>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<ModeSelector />} />
            <Route path="/developer" element={<DeveloperPage />} />
            <Route path="/creator" element={<CreatorPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </ModeProvider>
    </BrowserRouter>
  );
}
