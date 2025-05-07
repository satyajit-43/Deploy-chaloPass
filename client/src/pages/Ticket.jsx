import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function Ticket() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Redirect if missing data
  useEffect(() => {
    if (!state?.source || !state?.destination || !state?.userId || !state?.fare) {
      navigate('/');
    }
  }, [state, navigate]);

  // Generate ticket ID and bus number
  const ticketId = `CHALO${Math.floor(100000 + Math.random() * 900000)}`;
  const busNumber = `MH${Math.floor(10 + Math.random() * 90)}-${Math.floor(1000 + Math.random() * 9000)}`;
  const departureTime = new Date(Date.now() + 3600000).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-blue-600 text-white p-4">
          <h1 className="text-2xl font-bold">Chalo Pass Ticket</h1>
          <p className="text-sm">Ticket ID: {ticketId}</p>
        </div>

        <div className="p-6">
          <div className="flex justify-between mb-6">
            <div>
              <p className="text-gray-500">From</p>
              <p className="text-xl font-bold capitalize">{state.source}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500">To</p>
              <p className="text-xl font-bold capitalize">{state.destination}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-gray-500">Bus No.</p>
              <p className="font-medium">{busNumber}</p>
            </div>
            <div>
              <p className="text-gray-500">Departure</p>
              <p className="font-medium">{departureTime}</p>
            </div>
            <div>
              <p className="text-gray-500">Fare</p>
              <p className="font-medium">₹{state.fare}</p>
            </div>
            <div>
              <p className="text-gray-500">User ID</p>
              <p className="font-medium truncate">{state.userId}</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/')}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Book Another Ticket
          </button>
        </div>
      </div>
    </div>
  );
}
