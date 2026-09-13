import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Dashboard from './pages/Dashboard/Dashboard';
import Curriculum from './pages/Curriculum/Curriculum';
import Planner from './pages/Planner/Planner';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className="appShell">
        <Navbar />
        <div className="appContent">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/plan-de-estudios" element={<Curriculum />} />
            <Route path="/planificar" element={<Planner />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
