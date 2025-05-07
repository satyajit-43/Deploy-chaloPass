import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ScanTicket from './pages/ScanTicket';
import Ticket from './pages/Ticket';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scan" element={<ScanTicket />} />
        <Route path="/ticket" element={<Ticket />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;