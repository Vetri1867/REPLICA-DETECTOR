import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PlagiarismChecker from './pages/PlagiarismChecker';
import AIDetector from './pages/AIDetector';
import AIHumanizer from './pages/AIHumanizer';
import Report from './pages/Report';
import './index.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/plagiarism-checker" element={<PlagiarismChecker />} />
        <Route path="/ai-detector" element={<AIDetector />} />
        <Route path="/ai-humanizer" element={<AIHumanizer />} />
        <Route path="/report" element={<Report />} />
      </Routes>
    </Router>
  );
}

export default App;
