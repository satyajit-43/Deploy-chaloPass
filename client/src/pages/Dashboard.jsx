import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { QRCodeSVG } from 'qrcode.react';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('chaloPassToken');
        const response = await axios.get('http://localhost:5000/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(response.data.data); // Note the .data.data structure
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch user data');
        navigate('/login');
      }
    };
  
    fetchUserData();
  }, [navigate]);

  const handleAddMoney = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) ) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('chaloPassToken');
      const response = await axios.post(
        'http://localhost:5000/api/wallet/topup',
        { amount: parseFloat(amount) },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setUser(response.data.user);
      setAmount('');
      toast.success(`₹${amount} added successfully!`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add money');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Wallet Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Your Wallet</h2>
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-gray-600">Current Balance</p>
                <p className="text-3xl font-bold">₹{user.walletBalance.toFixed(2)}</p>
              </div>
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            <form onSubmit={handleAddMoney} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Add Money</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-600">₹</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="10"
                    step="10"
                    placeholder="100"
                    className="w-full pl-8 p-2 border rounded-md"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 ${loading ? 'opacity-70' : ''}`}
              >
                {loading ? 'Processing...' : 'Add Money'}
              </button>
            </form>
          </div>

          {/* QR Code Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Your Chalo Pass</h2>
        <div className="flex flex-col items-center">
          <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg mb-4">
            <QRCodeSVG 
              value={user.qrCode} 
              size={180}
              level="H"
              includeMargin={true}
            />
          </div>
          <p className="text-sm text-gray-600 text-center">
            Scan this QR code at bus terminals for payments
          </p>
        </div>
      </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-lg shadow-md p-6 h-[500px]">
            <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
            {user.transactions?.length > 0 ? (
              <div className="space-y-3">
                {user.transactions.slice(0, 5).map((txn, index) => (
                  <div key={index} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium">{txn.description}</p>
                      <p className="text-sm text-gray-500">{new Date(txn.date).toLocaleString()}</p>
                    </div>
                    <p className={`font-semibold ${txn.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                      {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No transactions yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;