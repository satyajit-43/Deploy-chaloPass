import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import QrScanner from 'qr-scanner';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function ScanTicket() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [scanResult, setScanResult] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fare, setFare] = useState(null);

  const scannerRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!state?.source || !state?.destination) {
      navigate('/');
      return;
    }

    startScanner();

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop();
        scannerRef.current.destroy();
      }
    };
  }, [navigate, state]);

  const startScanner = async () => {
    try {
      if (!videoRef.current) return;

      scannerRef.current = new QrScanner(
        videoRef.current,
        handleScanResult,
        {
          highlightScanRegion: true,
          maxScansPerSecond: 5,
          returnDetailedScanResult: true,
          preferredCamera: 'environment'
        }
      );

      await scannerRef.current.start();
      setCameraActive(true);
    } catch (err) {
      console.error('Camera error:', err);
      toast.error('Camera access denied or not available');
      setCameraActive(false);
    }
  };

  const handleScanResult = async (result) => {
    try {
      scannerRef.current?.stop();
      setScanResult(result.data);
      setLoading(true);

      const response = await axios.post('http://localhost:5000/api/qr/validate', {
        qrData: result.data,
        source: state.source,
        destination: state.destination
      });
      

      console.log(response.data)

      if (response.data.success) {
        setUserData(response.data.data);
        setFare(response.data.data.fare); // assuming fare is returned inside data
        toast.success(`Ticket booked for ${response.data.data.name}`);
      }
      else {
        toast.error(response.data.message || 'Invalid QR code');
        setTimeout(() => {
          setScanResult(null);
          scannerRef.current?.start();
        }, 2000);
      }
    } catch (error) {
      console.error('Validation error:', error);
      toast.error(error.response?.data?.message || 'Validation failed');
      setTimeout(() => {
        setScanResult(null);
        scannerRef.current?.start();
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  const proceedToTicket = () => {
    if (!userData || fare == null) return;
  
    navigate('/ticket', {
      state: {
        source: state.source,
        destination: state.destination,
        userId: userData.id,
        userName: userData.name,
        walletBalance: userData.walletBalance,
        fare: fare
      }
    });
  };
  

  const retryScan = () => {
    setScanResult(null);
    setUserData(null);
    scannerRef.current?.start();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Scan Your Chalo Pass QR</h2>
        <p className="mb-2">From: <span className="font-semibold">{state?.source}</span></p>
        <p className="mb-4">To: <span className="font-semibold">{state?.destination}</span></p>

        <div className="relative w-full h-64 bg-black rounded overflow-hidden mb-4">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
          ></video>

          {!cameraActive && (
            <div className="absolute inset-0 flex items-center justify-center text-white bg-black bg-opacity-70">
              <p>Initializing camera...</p>
            </div>
          )}

          {scanResult && (
            <div className={`absolute inset-0 flex flex-col items-center justify-center bg-opacity-80 text-white ${
              userData ? 'bg-green-500' : 'bg-red-500'
            }`}>
              <p className="text-lg font-semibold mb-2">
                {userData ? 'Valid QR Code' : 'Invalid QR Code'}
              </p>
              {!userData && (
                <button
                  onClick={retryScan}
                  className="mt-2 px-4 py-1 bg-white text-black rounded hover:bg-gray-100"
                >
                  Try Again
                </button>
              )}
            </div>
          )}

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>

        {userData && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="font-medium">User: {userData.name}</p>
            <p>Email: {userData.email}</p>
            <p>Wallet Balance: ₹{userData.walletBalance.toFixed(2)}</p>
          </div>
        )}

        <div className="flex space-x-3">
          <button
            onClick={() => navigate('/')}
            className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>

          {userData ? (
            <button
              onClick={proceedToTicket}
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Show Ticket'}
            </button>
          ) : (
            <button
              onClick={retryScan}
              className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Scan Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
