import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');

  // Dummy locations
  const locations = [
    "Mumbai Central",
    "Pune Station",
    "Nashik Road",
    "Nagpur",
    "Thane"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (source && destination) {
      navigate('/scan', { state: { source, destination } });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Chalo Pass - Book Bus Ticket</h1>
        
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">
            Chalo Pass
          </Link>
          <div className="flex space-x-4">
            <Link 
              to="/register" 
              className="px-3 py-2 rounded hover:bg-blue-700 transition"
            >
              Register
            </Link>
            <Link 
              to="/login" 
              className="px-3 py-2 rounded hover:bg-blue-700 transition"
            >
              Login
            </Link>
          </div>
          </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">From</label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Source</option>
              {locations.map((loc) => (
                <option key={`source-${loc}`} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">To</label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Destination</option>
              {locations.map((loc) => (
                <option key={`dest-${loc}`} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Continue to Scan QR
          </button>
        </form>
      </div>
    </div>
  );
}